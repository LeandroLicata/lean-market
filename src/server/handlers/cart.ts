import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

const cartInclude = {
  items: {
    include: { product: { include: { Brands: true } } },
    // Sin orden explícito las filas vuelven en orden arbitrario y los ítems
    // saltan de lugar en la UI después de cada update.
    orderBy: { createdAt: "asc" },
  },
} satisfies Prisma.CartsInclude;

/** Carrito vacío para un usuario que todavía no tiene uno en la DB. */
const EMPTY_CART = { id: null, items: [] };

const unauthorized = () =>
  NextResponse.json({ error: "No autorizado" }, { status: 401 });

const badRequest = (message: string) =>
  NextResponse.json({ error: message }, { status: 400 });

const notFound = (message: string) =>
  NextResponse.json({ error: message }, { status: 404 });

const serverError = (error: unknown, context: string) => {
  console.error(`${context}:`, error);
  return NextResponse.json({ error: "Algo salió mal" }, { status: 500 });
};

const units = (quantity: number) =>
  `${quantity} ${quantity === 1 ? "unidad" : "unidades"}`;

const stockError = (stock: number, alreadyInCart: number) => {
  if (stock === 0) return "El producto ya no tiene stock disponible";
  if (alreadyInCart > 0) {
    return `Solo hay ${units(stock)} disponibles y ya tenés ${alreadyInCart} en el carrito`;
  }
  return `Solo hay ${units(stock)} disponibles`;
};

/** Cantidad entera válida, o `null` si el valor no sirve. */
const parseQuantity = (value: unknown, { allowZero = false } = {}) => {
  const quantity = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(quantity)) return null;
  if (quantity < (allowZero ? 0 : 1)) return null;
  return quantity;
};

const findCart = (userId: string) =>
  prisma.carts.findUnique({ where: { userId }, include: cartInclude });

/** Crea el carrito si el usuario todavía no tiene uno. */
const ensureCart = (userId: string) =>
  prisma.carts.upsert({ where: { userId }, create: { userId }, update: {} });

export async function getCart() {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const cart = await findCart(userId);
    return NextResponse.json(cart ?? EMPTY_CART);
  } catch (error) {
    return serverError(error, "Error fetching cart");
  }
}

/** Suma unidades de un producto al carrito. */
export async function addToCart(req: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const body = await req.json();
    const productId = typeof body?.productId === "string" ? body.productId : "";
    if (!productId) return badRequest("Falta el id del producto");

    const quantity = parseQuantity(body?.quantity ?? 1);
    if (quantity === null) {
      return badRequest("La cantidad debe ser un entero mayor a cero");
    }

    const product = await prisma.products.findUnique({
      where: { id: productId },
      select: { stock: true },
    });
    if (!product) return notFound("Producto no encontrado");

    const cart = await ensureCart(userId);

    const existing = await prisma.cartItems.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
      select: { quantity: true },
    });

    // El stock se valida acá y no solo en el cliente: por API se podían cargar
    // más unidades de las que existen.
    const alreadyInCart = existing?.quantity ?? 0;
    const desired = alreadyInCart + quantity;
    if (desired > product.stock) {
      return NextResponse.json(
        { error: stockError(product.stock, alreadyInCart), stock: product.stock },
        { status: 409 }
      );
    }

    await prisma.cartItems.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      create: { cartId: cart.id, productId, quantity },
      update: { quantity: desired },
    });

    return NextResponse.json(await findCart(userId));
  } catch (error) {
    return serverError(error, "Error adding to cart");
  }
}

/** Fija la cantidad de un ítem. Con `quantity: 0` lo quita. */
export async function updateCartItem(req: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const body = await req.json();
    const productId = typeof body?.productId === "string" ? body.productId : "";
    if (!productId) return badRequest("Falta el id del producto");

    const quantity = parseQuantity(body?.quantity, { allowZero: true });
    if (quantity === null) {
      return badRequest("La cantidad debe ser un entero mayor o igual a cero");
    }

    const cart = await prisma.carts.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!cart) return notFound("El carrito está vacío");

    if (quantity === 0) {
      await prisma.cartItems.deleteMany({
        where: { cartId: cart.id, productId },
      });
      return NextResponse.json(await findCart(userId));
    }

    const product = await prisma.products.findUnique({
      where: { id: productId },
      select: { stock: true },
    });
    if (!product) return notFound("Producto no encontrado");

    if (quantity > product.stock) {
      return NextResponse.json(
        { error: stockError(product.stock, 0), stock: product.stock },
        { status: 409 }
      );
    }

    const { count } = await prisma.cartItems.updateMany({
      where: { cartId: cart.id, productId },
      data: { quantity },
    });
    if (count === 0) return notFound("El producto no está en el carrito");

    return NextResponse.json(await findCart(userId));
  } catch (error) {
    return serverError(error, "Error updating cart item");
  }
}

/** Sin `productId` en la query, vacía el carrito completo. */
export async function removeFromCart(req: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const productId = new URL(req.url).searchParams.get("productId");

    const cart = await prisma.carts.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!cart) return NextResponse.json(EMPTY_CART);

    await prisma.cartItems.deleteMany({
      where: { cartId: cart.id, ...(productId ? { productId } : {}) },
    });

    return NextResponse.json(await findCart(userId));
  } catch (error) {
    return serverError(error, "Error removing from cart");
  }
}

/**
 * Valida los ítems que manda el carrito de invitado y los agrupa por producto,
 * porque el localStorage puede llegar con datos viejos o repetidos.
 */
const parseIncomingItems = (value: unknown) => {
  if (!Array.isArray(value)) return null;

  const byProduct = new Map<string, number>();
  for (const raw of value) {
    const productId = typeof raw?.productId === "string" ? raw.productId : "";
    const quantity = parseQuantity(raw?.quantity);
    if (!productId || quantity === null) return null;
    byProduct.set(productId, (byProduct.get(productId) ?? 0) + quantity);
  }
  return byProduct;
};

/**
 * Contrasta los ítems del invitado con la DB: descarta productos borrados o sin
 * stock, topea las cantidades y devuelve los datos frescos del producto.
 */
export async function validateGuestCart(req: Request) {
  try {
    const body = await req.json();
    const incoming = parseIncomingItems(body?.items);
    if (!incoming) return badRequest("Formato de carrito inválido");

    const products = await prisma.products.findMany({
      where: { id: { in: [...incoming.keys()] } },
      include: { Brands: true },
    });
    const byId = new Map(products.map((product) => [product.id, product]));

    const items = [];
    const adjustments: string[] = [];

    for (const [productId, requested] of incoming) {
      const product = byId.get(productId);

      if (!product) {
        adjustments.push("Se quitó un producto que ya no está disponible");
        continue;
      }
      if (product.stock === 0) {
        adjustments.push(`${product.name} se quedó sin stock y se quitó`);
        continue;
      }

      const quantity = Math.min(requested, product.stock);
      if (quantity < requested) {
        adjustments.push(
          `${product.name}: la cantidad quedó en ${units(quantity)} por stock`
        );
      }

      // El invitado no tiene filas en la DB: se usa el productId como id, que
      // también es único por carrito.
      items.push({ id: productId, productId, quantity, product });
    }

    return NextResponse.json({ id: null, items, adjustments });
  } catch (error) {
    return serverError(error, "Error validating guest cart");
  }
}

/** Fusiona el carrito de invitado con el del usuario al iniciar sesión. */
export async function mergeGuestCart(req: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const body = await req.json();
    const incoming = parseIncomingItems(body?.items);
    if (!incoming) return badRequest("Formato de carrito inválido");

    if (incoming.size === 0) {
      const cart = await findCart(userId);
      return NextResponse.json({ ...(cart ?? EMPTY_CART), adjustments: [] });
    }

    const cart = await ensureCart(userId);

    const [existingItems, products] = await Promise.all([
      prisma.cartItems.findMany({
        where: { cartId: cart.id },
        select: { productId: true, quantity: true },
      }),
      prisma.products.findMany({
        where: { id: { in: [...incoming.keys()] } },
        select: { id: true, name: true, stock: true },
      }),
    ]);

    const alreadyInCart = new Map(
      existingItems.map((item) => [item.productId, item.quantity])
    );
    const byId = new Map(products.map((product) => [product.id, product]));

    const adjustments: string[] = [];
    const operations: Prisma.PrismaPromise<unknown>[] = [];

    for (const [productId, guestQuantity] of incoming) {
      const product = byId.get(productId);

      if (!product || product.stock === 0) {
        adjustments.push(
          product
            ? `${product.name} se quedó sin stock y no se agregó`
            : "Un producto de tu carrito ya no está disponible"
        );
        continue;
      }

      const existing = alreadyInCart.get(productId) ?? 0;
      const desired = existing + guestQuantity;
      const quantity = Math.min(desired, product.stock);

      if (quantity < desired) {
        adjustments.push(
          `${product.name}: quedó en ${units(quantity)} por stock disponible`
        );
      }
      if (quantity === existing) continue;

      operations.push(
        prisma.cartItems.upsert({
          where: { cartId_productId: { cartId: cart.id, productId } },
          create: { cartId: cart.id, productId, quantity },
          update: { quantity },
        })
      );
    }

    if (operations.length > 0) {
      await prisma.$transaction(operations);
    }

    const merged = await findCart(userId);
    return NextResponse.json({ ...(merged ?? EMPTY_CART), adjustments });
  } catch (error) {
    return serverError(error, "Error merging guest cart");
  }
}
