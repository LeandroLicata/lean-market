import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function getCart() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: { email: session.user.email },
      include: {
        cart: {
          include: {
            items: { include: { product: true } },
          },
        },
      },
    });

    if (!user || !user.cart) {
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json(user.cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function addToCart(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.users.findUnique({
      where: { email: session.user.email },
      include: { cart: { include: { items: { include: { product: true } } } } },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let cartId = user.cart?.id;
    if (!cartId) {
      const newCart = await prisma.carts.create({
        data: { userId: user.id },
        include: { items: { include: { product: true } } },
      });
      cartId = newCart.id;
      user.cart = newCart;
    }

    const existingItem = await prisma.cartItems.findFirst({
      where: { cartId, productId },
    });

    if (existingItem) {
      await prisma.cartItems.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (quantity || 1) },
      });
    } else {
      await prisma.cartItems.create({
        data: { cartId, productId, quantity: quantity || 1 },
      });
    }

    const updatedCart = await prisma.carts.findUnique({
      where: { id: cartId },
      include: { items: { include: { product: true } } },
    });

    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
