import type { DefaultSession } from "next-auth";

// El `import` de arriba es necesario: sin él este archivo sería un script global
// y el `declare module` reemplazaría los tipos de next-auth en vez de extenderlos.

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
