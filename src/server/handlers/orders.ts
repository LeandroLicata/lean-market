import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

const orderInclude = {
  items: { include: { product: { include: { Brands: true } } } },
};

/** Se lanza dentro de la transacción para abortarla y avisar qué faltó. */
class InsufficientStockError extends Error {
  constructor(public productName: string) {
    super(`No queda stock suficiente de ${productName}`);
    this.name = "InsufficientStockError";
  }
}

export async function confirmOrder() {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const cart = await prisma.carts.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Tu carrito está vacío" },
        { status: 400 }
      );
    }

    const withoutPrice = cart.items.filter((item) => item.product.price === null);
    if (withoutPrice.length > 0) {
      return NextResponse.json(
        {
          error: `${withoutPrice[0].product.name} no tiene precio: no podemos cobrarlo`,
        },
        { status: 409 }
      );
    }

    const total = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    const order = await prisma.$transaction(async (tx) => {
      for (const item of cart.items) {
        // El `gte` hace la validación y el descuento en una sola sentencia
        // atómica: si otra compra se llevó el stock en el medio, no actualiza
        // nada y el stock nunca queda negativo.
        const { count } = await tx.products.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });

        if (count === 0) {
          throw new InsufficientStockError(item.product.name);
        }
      }

      const createdOrder = await tx.orders.create({
        data: {
          userId,
          total,
          status: "pending",
          items: {
            create: cart.items.map((item) => ({
              quantity: item.quantity,
              priceAtPurchase: item.product.price!,
              product: { connect: { id: item.productId } },
            })),
          },
        },
        include: orderInclude,
      });

      await tx.cartItems.deleteMany({ where: { cartId: cart.id } });

      return createdOrder;
    });

    return NextResponse.json(order);
  } catch (error) {
    if (error instanceof InsufficientStockError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Error confirming order:", error);
    return NextResponse.json(
      { error: "No pudimos confirmar la compra" },
      { status: 500 }
    );
  }
}

export async function getOrders() {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const orders = await prisma.orders.findMany({
      where: { userId },
      include: orderInclude,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Algo salió mal" }, { status: 500 });
  }
}
