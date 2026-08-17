import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  getPasswordError,
  isValidEmail,
  normalizeEmail,
} from "@/lib/validation";

const BCRYPT_ROUNDS = 10;

export async function registerUser(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body?.email === "string" ? normalizeEmail(body.email) : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email y contraseña requeridos" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ message: "Email inválido" }, { status: 400 });
    }

    const passwordError = getPasswordError(password);
    if (passwordError) {
      return NextResponse.json({ message: passwordError }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

    try {
      // Sin chequeo previo de existencia: se delega al `@unique` de la DB, que no
      // tiene la ventana de carrera de un findUnique + create.
      const user = await prisma.users.create({
        data: { email, hashedPassword },
        select: { id: true, email: true },
      });

      return NextResponse.json(
        { message: "Usuario registrado", user },
        { status: 201 }
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return NextResponse.json(
          { message: "El email ya está registrado" },
          { status: 409 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}
