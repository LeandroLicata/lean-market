
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
// import type { Session } from "next-auth";
// import type { JWT } from "next-auth/jwt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.users.findUnique({
          where: { email: credentials.email },
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

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
  // session: {
  //   strategy: "jwt",
  // },
  // callbacks: {
  //   async jwt({ token, user }: { token: JWT; user: any }) {
  //     if (user) token.id = user.id;
  //     return token;
  //   },
  //   async session({ session, token }: { session: Session; token: JWT }) {
  //     if (session.user && token.id) {
  //       (session.user as any).id = token.id;
  //     }
  //     return session;
  //   },
  // },
  secret: process.env.NEXTAUTH_SECRET,
};
