import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
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
