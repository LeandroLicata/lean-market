# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## LeanMarket

E-commerce de electrónica hecho con Next.js 15 (App Router), TypeScript, TailwindCSS,
Prisma + PostgreSQL (Supabase), NextAuth v4 y Redux Toolkit.

## Comandos

```bash
npm run dev          # dev server (turbopack)
npm run build
npm run lint         # eslint (next lint)
npx tsc --noEmit     # chequeo de tipos; el build no es la forma rápida de verificar
npm run seed:stock   # carga stock en los productos que están en 0
npx prisma generate  # corre solo en postinstall
npx prisma db push   # aplicar cambios de schema (ver abajo)
```

**No hay tests ni framework de testing en el proyecto.** Para verificar un cambio:
`npx tsc --noEmit` + `npm run lint`, y si hace falta probarlo de verdad, `npm run dev`.
No inventar un runner ni agregar uno sin que lo pidan.

No correr `next build` con el dev server levantado: los dos escriben en `.next` y el
dev server queda sirviendo "missing required error components". Si pasa, matar el proceso,
borrar `.next` y volver a levantarlo.

`prisma/seed-stock.mjs` existe porque `stock` se agregó al schema con `@default(0)`
después de haber cargado los productos y quedaron todos sin stock. Es idempotente y por
defecto solo toca los que están en 0; con `-- --force` recalcula todos. Deja dos productos
sin stock a propósito, para que el estado "Sin stock" de la tienda sea visible.

## Base de datos: usar `db push`, NO `migrate`

`prisma/migrations/` contiene una sola migración con Brands, Products y Users. Todo lo
que vino después (Carts, CartItems, Orders, OrderItems, `Products.stock`,
`Products.specifications`) se aplicó con `prisma db push`, así que **el historial de
migraciones está desincronizado con la base real**.

Los cambios de schema van con `npx prisma db push`. No correr `prisma migrate dev`: ve la
base como divergente del historial y puede ofrecer resetearla, lo que borraría los datos.
Si en algún momento se quiere volver a migraciones, hay que baselinear primero
(`migrate diff` contra la base + `migrate resolve --applied`).

Después de regenerar el cliente, VS Code sigue mostrando los tipos viejos hasta que se
reinicie su TS server (`Ctrl+Shift+P` → "TypeScript: Restart TS Server"). Si aparece un
error sobre una propiedad de Prisma que sí existe en el schema, verificar con
`npx tsc --noEmit` antes de tocar el código: si tsc pasa, es caché del IDE.

## Cómo está armado

```
src/app/            páginas y API routes (App Router)
  api/<recurso>/    routes de una línea que re-exportan un handler
src/server/handlers/ toda la lógica de servidor
src/features/       slices de Redux Toolkit, uno por dominio
src/hooks/          lo que consumen los componentes
src/components/     componentes compartidos
src/lib/            auth, prisma, validación, helpers
src/types/          tipos compartidos, uno por entidad
```

`src/app/layout.tsx` es server component; los providers (`SessionProvider`,
`ReduxProvider`) viven en `src/components/Providers.tsx` para no volver cliente a toda la
app. Si se agrega un provider, va ahí.

## El carrito tiene dos modos

Es la parte con más sutilezas del proyecto.

- **Invitado**: vive en `localStorage` (`leanmarket:guest-cart`), lo manejan reducers
  puros del `cartSlice` (`guestItem*`).
- **Autenticado**: vive en la DB, lo manejan los thunks contra `/api/cart`.

`useCart` elige el modo y expone la misma interfaz para los dos, así que los componentes
no se enteran de la diferencia.

Tres reglas que hay que respetar al tocarlo:

1. **`CartSync` es el dueño único de la carga.** Está montado una sola vez en los
   providers. Ningún hook ni componente debe disparar la carga inicial del carrito: si se
   hace desde `useCart`, vuelve el bug de pedir el carrito una vez por componente y el
   merge puede dispararse dos veces en paralelo.
2. **La persistencia del carrito de invitado pasa solo por la suscripción en
   `store.ts`**, y está guardada por el flag `hydrated`. Sin ese flag, el estado inicial
   vacío se guarda antes de leer el localStorage y borra el carrito en cada navegación.
   No escribir en localStorage desde reducers ni componentes.
3. Al iniciar sesión, `CartSync` detecta la transición y llama a `/api/cart/merge`, que
   suma cantidades y las topea al stock. El localStorage se limpia **solo si el merge
   salió bien**, para poder reintentar.

El carrito de invitado se revalida contra `/api/cart/validate` al cargarlo, porque la
copia del producto guardada en localStorage puede tener precio o stock viejos. Los dos
endpoints devuelven `adjustments`: mensajes ya en español, listos para mostrar.

## La compra

`confirmOrder` (`src/server/handlers/orders.ts`) corre entera en una transacción:
descuenta stock, crea la orden con sus ítems y vacía el carrito, o no hace nada.

El descuento usa `updateMany` con `where: { stock: { gte: cantidad } }`: la validación y
el descuento son una sola sentencia atómica. Si `count === 0`, el producto se quedó sin
stock y se lanza para abortar la transacción. **No reemplazar eso por leer el stock y
después restarlo**: ahí vuelve la ventana de carrera que dejaba stock negativo.

Todavía no hay pasarela de pago: la orden queda en `pending`.

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
- **Los mensajes de error los escribe el servidor.** Los handlers responden
  `{ error: "..." }` con el texto ya en español; los thunks se declaran con
  `rejectValue: string` y lo rescatan con el helper `asMessage`, que prioriza el mensaje
  del servidor sobre el fallback. Los componentes usan `.unwrap()` para que llegue tal
  cual. No traducir ni reescribir esos mensajes en el cliente.
- `src/server/handlers/cart.ts` tiene helpers de respuesta (`unauthorized`, `badRequest`,
  `notFound`, `serverError`) que conviene reusar al agregar handlers ahí. Los conflictos
  de stock van con **409**, no 400.
- **Los slices pueden reaccionar a acciones de otros slices.** `cartSlice` escucha
  `confirmOrder.fulfilled` (de `orderSlice`) para vaciar el carrito: no agregar un
  `clearCart` manual después de comprar, ya está cubierto.
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
- `.env` no se commitea (`.gitignore` ignora `.env*`, con excepción para `.env.example`).
  Necesita `DATABASE_URL`, `NEXTAUTH_SECRET` y, en producción, `NEXTAUTH_URL`.
- `session.user.id` existe porque los callbacks `jwt`/`session` de `src/lib/auth.ts` lo
  ponen. Los handlers lo leen con `getSessionUserId()`; no hace falta buscar el usuario
  por email.
- **El middleware protege páginas, no la API.** Cada handler que necesita sesión llama a
  `getSessionUserId()` y devuelve 401 por su cuenta (carrito, órdenes). Ojo: los handlers
  de `products` y `brands` mutan **sin ninguna validación de sesión** — si se arma el ABM
  de productos, la auth hay que agregarla ahí.
- Las rutas protegidas se declaran en el `matcher` de `src/middleware.ts`. `/cart` queda
  fuera a propósito: un invitado puede ver su carrito y el login se le pide en el checkout.
- `/api/products` **pagina de a 8**. Devuelve `{ products, totalPages, currentPage }`, no
  un array. Para traer todo hay que pasar `?limit=100`.
- `next.config.js` habilita `hostname: "**"` en `images.remotePatterns`, por eso las
  imágenes de cualquier tienda externa cargan sin tocar config.
- `getRandomProducts` (home) usa SQL crudo (`ORDER BY RANDOM()`), así que devuelve las
  columnas de `Products` sin el `include` de `Brands`, a diferencia del resto.
- Las imágenes de productos son URLs de tiendas externas y varias se caen con el tiempo.
  Usar el componente `ProductImage`, que muestra un reemplazo con `onError`.
