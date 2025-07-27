import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
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
