import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  try {
    const products = await prisma.products.findMany({
      where: query
        ? {
            name: {
              contains: query,
              mode: "insensitive",
            },
          }
        : undefined,
      include: {
        Brands: true,
      },
    });

    if (!products || products.length === 0) {
      return NextResponse.json(
        { message: "No products found" },
        { status: 404 }
      );
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", String(error));

    return NextResponse.json(
      {
        message: "Error fetching products",
        error: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}
