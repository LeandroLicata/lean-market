import { NextResponse } from "next/server";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { normalizeEmail } from "./validation";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.users.findUnique({
          where: { email: normalizeEmail(credentials.email) },
        });

        if (!user) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!passwordMatch) {
          return null;
        }

        // Se devuelve solo lo que va al token: nunca el hash.
        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      // `user` solo viene en el login inicial.
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * Id del usuario autenticado, o `null` si no hay sesión.
 * Los handlers lo usan en lugar de buscar el usuario por email en cada request.
 */
export async function getSessionUserId() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

/**
 * Devuelve la respuesta de error si quien llama no es admin, o `null` si puede
 * seguir. Se usa como guarda al principio de cada mutación:
 *
 *   const denied = await denyIfNotAdmin();
 *   if (denied) return denied;
 *
 * El rol se lee de la DB en cada llamada en vez de guardarlo en el JWT: son
 * mutaciones poco frecuentes, y así quitarle el rol a alguien tiene efecto de
 * inmediato en lugar de esperar a que su token expire.
 */
export async function denyIfNotAdmin() {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (user?.role !== "admin") {
    return NextResponse.json(
      { error: "Necesitás permisos de administrador" },
      { status: 403 }
    );
  }

  return null;
}
