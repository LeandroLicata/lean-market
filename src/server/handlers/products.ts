import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getProducts(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const brandId = searchParams.get("brandId");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 8;

  const filters: Prisma.ProductsWhereInput = {};

  const skip = (page - 1) * limit;

  const totalProducts = await prisma.products.count({ where: filters });
  const totalPages = Math.ceil(totalProducts / limit);

  if (query) filters.name = { contains: query, mode: "insensitive" };

  if (brandId) filters.BrandId = brandId;

  if (minPrice || maxPrice) {
    filters.price = {
      ...(minPrice && { gte: Number(minPrice) }),
      ...(maxPrice && { lte: Number(maxPrice) }),
    };
  }

  try {
    const products = await prisma.products.findMany({
      where: filters,
      include: { Brands: true },
      skip,
      take: limit,
    });

    return NextResponse.json(
      { products, totalPages, currentPage: page },
      { status: 200 }
    );
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

export async function createProduct(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, brandId, imageUrl, specifications } =
      body;

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
        image_url: imageUrl ?? null,
        BrandId: brandId,
        specifications: specifications ?? null,
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

export async function getRandomProducts() {
  try {
    const products = await prisma.$queryRaw`
      SELECT * FROM "Products"
      ORDER BY RANDOM()
      LIMIT 4;
    `;

    if (!products || (Array.isArray(products) && products.length === 0)) {
      return NextResponse.json(
        { message: "No random products found" },
        { status: 404 }
      );
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching random products:", String(error));

    return NextResponse.json(
      {
        message: "Error fetching random products",
        error: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}

export async function getProductById(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.products.findUnique({
      where: { id },
      include: {
        Brands: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product by id:", String(error));

    return NextResponse.json(
      {
        message: "Error fetching product by id",
        error: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}
