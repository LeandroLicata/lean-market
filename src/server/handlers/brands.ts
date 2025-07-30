import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function createBrand(req: Request) {
  try {
    const body = await req.json();
    const { name, logo_url } = body;

    // Validación manual básica
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "El nombre de la marca es requerido y debe ser un string." },
        { status: 400 }
      );
    }

    const brand = await prisma.brands.create({
      data: {
        name,
        logo_url: logo_url || null, // opcional
      },
    });

    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    console.error("Error al crear la marca:", error);
    return NextResponse.json(
      { error: "Error al crear la marca." },
      { status: 500 }
    );
  }
}

export async function getBrands() {
  try {
    const brands = await prisma.brands.findMany({
      orderBy: {
        name: "asc", // Opcional: ordena alfabéticamente
      },
    });

    return NextResponse.json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    return new NextResponse("Error fetching brands", { status: 500 });
  }
}
