import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, brandId, imageUrl } = body;

    // Validaciones mínimas
    if (!name || !price || !brandId) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios (name, price, brandId)" },
        { status: 400 }
      );
    }

    const existingBrand = await prisma.brands.findUnique({
      where: { id: brandId },
    });

    if (!existingBrand) {
      return NextResponse.json(
        { message: "La marca no existe" },
        { status: 404 }
      );
    }

    const newProduct = await prisma.products.create({
      data: {
        name,
        description,
        price,
        image_url: imageUrl ?? null, // si usás image_url en tu modelo
        BrandId: brandId,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", String(error));

    return NextResponse.json(
      {
        message: "Error al crear el producto",
        error: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}
