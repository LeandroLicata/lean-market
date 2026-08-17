# 🛒 LeanMarket

**LeanMarket** es un e-commerce en desarrollo centrado en productos electrónicos y accesorios tecnológicos como consolas, auriculares, televisores y teléfonos. Está construido completamente con Next.js, lo que permite manejar tanto el frontend como el backend dentro del mismo proyecto.

### Tecnologías Utilizadas

- Next.js (Frontend + API Routes)
- TypeScript
- TailwindCSS
- Prisma (ORM para PostgreSQL)
- NextAuth
- (Próximamente) Pasarela de pago

### Instrucciones de Uso

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/LeandroLicata/lean-market
   cd lean-market
   ```

2. Instala las dependencias utilizando npm o yarn:

   ```bash
   npm install
   ```

   o

   ```bash
   yarn install
   ```

3. Copiá `.env.example` a `.env` y completá las variables. Tiene que llamarse `.env`: es el
   único archivo que lee el CLI de Prisma.

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL`: PostgreSQL, en la nube (Supabase) o local.
   - `NEXTAUTH_SECRET`: firma las sesiones. Generalo con `openssl rand -base64 32`.
   - `NEXTAUTH_URL`: en desarrollo NextAuth la infiere, en producción es obligatoria.

4. Genera el cliente de Prisma y sincroniza el esquema de base de datos:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

   📌 `npx prisma db push` creará las tablas según el archivo `schema.prisma`.

   ⚠️ Usá siempre `db push`, no `prisma migrate dev`. La carpeta `prisma/migrations`
   tiene una sola migración vieja y el resto del esquema se aplicó con `db push`, así que
   `migrate dev` ve la base como divergente y puede ofrecer resetearla, borrando los datos.

5. Cargá stock en los productos (si la base viene con productos en stock 0):

   ```bash
   npm run seed:stock
   ```

6. Levanta el proyecto localmente:

   ```bash
   npm run dev
   ```

   o

   ```bash
   yarn dev
   ```

7. Abre tu navegador en [http://localhost:3000](http://localhost:3000) para ver la app en acción.

### Funcionalidades Actuales

**Catálogo**

- Visualización de productos en el Home, con destacados elegidos al azar.
- Página de detalle con especificaciones técnicas y stock disponible.
- Búsqueda y filtros por marca, precio y orden, con paginación.
- CRUD completo de productos (crear, leer, actualizar, eliminar).
- Diseño responsive.

**Cuentas**

- Registro e inicio de sesión con NextAuth (credenciales + bcrypt, sesión JWT).
- Rutas protegidas por middleware: al entrar a una página privada se vuelve a
  donde estabas después de autenticarte.

**Carrito**

- Funciona sin cuenta: se guarda en el navegador y al iniciar sesión se fusiona
  con el de tu cuenta, sumando cantidades y respetando el stock.
- Cambiar cantidades, quitar productos y vaciar el carrito.
- El stock se valida en el servidor, no solo en el cliente.
- Si el stock cambió mientras el producto estaba en el carrito, se avisa y se
  ajusta la cantidad.

**Compra**

- Checkout con resumen y confirmación.
- La compra corre dentro de una transacción: descuenta stock, crea el pedido y
  vacía el carrito, o no hace nada. El stock nunca queda negativo.
- Historial de pedidos con su estado.

### Funcionalidades en Desarrollo

- Formulario para crear y editar productos.
- Pasarela de pago. Hoy el pedido queda como pendiente de pago.

### Estructura del Backend

LeanMarket utiliza un enfoque fullstack con Next.js:

- La lógica del servidor se desarrolla usando API Routes de Next.js (/api), permitiendo crear endpoints personalizados para funcionalidades como autenticación, gestión de productos o pagos.
- La conexión a la base de datos se gestiona a través de Prisma, un ORM moderno que facilita el acceso y manipulación de datos en PostgreSQL.
- Las rutas son de una línea: la lógica vive en `src/server/handlers/<recurso>.ts` y el
  archivo `route.ts` solo la re-exporta.
- En el cliente, cada dominio tiene su slice de Redux Toolkit en `src/features/`, y los
  componentes lo consumen a través de un hook de `src/hooks/`.

### Notas Adicionales

- LeanMarket está pensado como un proyecto integral para demostrar conocimientos en fullstack con tecnologías modernas.
- El proyecto está publicado en Vercel. **Link:** [lean-market.vercel.app](https://lean-market.vercel.app/)

---

¡Gracias por visitar este proyecto! Si tenés comentarios, sugerencias o querés colaborar, no dudes en contactarme.

📬 **Leandro Licata** – [leandro-licata-portfolio.vercel.app](https://leandro-licata-portfolio.vercel.app/)
