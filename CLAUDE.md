# LeanMarket

E-commerce de electrónica hecho con Next.js 15 (App Router), TypeScript, TailwindCSS,
Prisma + PostgreSQL (Supabase), NextAuth v4 y Redux Toolkit.

## Comandos

```bash
npm run dev          # dev server (turbopack)
npm run build
npm run lint
npx prisma generate  # corre solo en postinstall
npx prisma db push   # aplicar cambios de schema (ver abajo)
```

## Base de datos: usar `db push`, NO `migrate`

`prisma/migrations/` contiene una sola migración con Brands, Products y Users. Todo lo
que vino después (Carts, CartItems, Orders, OrderItems, `Products.stock`,
`Products.specifications`) se aplicó con `prisma db push`, así que **el historial de
migraciones está desincronizado con la base real**.

Los cambios de schema van con `npx prisma db push`. No correr `prisma migrate dev`: ve la
base como divergente del historial y puede ofrecer resetearla, lo que borraría los datos.
Si en algún momento se quiere volver a migraciones, hay que baselinear primero
(`migrate diff` contra la base + `migrate resolve --applied`).

## Convenciones del código

- **API routes son de una línea.** La lógica vive en `src/server/handlers/<recurso>.ts` y
  `src/app/api/<recurso>/route.ts` solo re-exporta: `export const GET = getCart;`
- **Un slice por feature** en `src/features/<x>/<x>Slice.ts`, con `createAsyncThunk` +
  axios para hablar con las API routes. Registrados en `src/store/store.ts`.
- **Los componentes no usan los slices directo:** van por un hook en `src/hooks/`
  (`useCart`, `useProducts`, `useBrands`) que expone datos + acciones ya envueltas.
- El estado de carga se modela con `Status` (`src/types/status.ts`) y, cuando un slice
  tiene varias operaciones, se usa un `Record` por operación en vez de un `status` global
  (ver `orderSlice`).
- Tipos compartidos en `src/types/`, uno por entidad.
- Alias de imports: `@/` → `src/`.
- Diálogos y feedback al usuario con SweetAlert2 (`Swal.fire`).

## Detalles de dominio

- **Todos los textos de UI van en español.**
- Los precios son `Decimal` en Prisma, así que llegan al cliente **como string** en el
  JSON. Convertir con `Number()` antes de operar.
- Autenticación por credenciales (email + password con bcrypt), sesión JWT. El email se
  normaliza a lowercase tanto al registrar como al autenticar: si se cambia en un lado,
  hay que cambiarlo en el otro o los logins fallan.
- `.env` no se commitea (`.gitignore` ignora `.env*`). Necesita `DATABASE_URL`,
  `NEXTAUTH_SECRET` y, en producción, `NEXTAUTH_URL`.
