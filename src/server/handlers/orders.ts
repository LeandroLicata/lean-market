import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

export async function confirmOrder() {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const cart = await prisma.carts.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
    }

    const total = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    const order = await prisma.$transaction(async (tx) => {
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
      });

      // actualizar stock
      for (const item of cart.items) {
        await tx.products.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // vaciar carrito
      await tx.cartItems.deleteMany({ where: { cartId: cart.id } });

      return createdOrder;
    });

    return NextResponse.json({ message: "Compra confirmada", order });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al confirmar la compra" },
      { status: 500 }
    );
  }
}

export async function getOrders() {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.orders.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders: ", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
