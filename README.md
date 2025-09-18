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

3. Crea un archivo `.env.local` en la raíz del proyecto y añade las siguientes variables necesarias para conectar a la base de datos PostgreSQL. Podés usar una instancia en la nube (como Supabase) o una local:

   ```env
   DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/nombre_basedatos
   ```

4. Genera el cliente de Prisma y sincroniza el esquema de base de datos:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

   📌 `npx prisma db push` creará las tablas según el archivo `schema.prisma`. Si más adelante trabajás con migraciones, podés usar: 
   
   ```
   npx prisma migrate dev
   ```

5. Levanta el proyecto localmente:

   ```bash
   npm run dev
   ```

   o

   ```bash
   yarn dev
   ```

6. Abre tu navegador en [http://localhost:3000](http://localhost:3000) para ver la app en acción.

### Funcionalidades Actuales

- Visualización de productos en el Home.
- Productos destacados seleccionados al azar.
- Backend conectado a Supabase con rutas funcionales:
  - Obtener todos los productos.
  - Obtener 4 productos aleatorios para la sección de destacados.
- CRUD completo de productos (crear, leer, actualizar, eliminar).
- Diseño responsive.
- Página de detalle de producto.
- Sistema de autenticación con NextAuth.
- Página de resultados de búsqueda con filtros.

### Funcionalidades en Desarrollo

- Formulario para crear y editar productos.
- Carrito de compras.
- Sistema de pagos.

### Estructura del Backend

LeanMarket utiliza un enfoque fullstack con Next.js:

- La lógica del servidor se desarrolla usando API Routes de Next.js (/api), permitiendo crear endpoints personalizados para funcionalidades como autenticación, gestión de productos o pagos.
- La conexión a la base de datos se gestiona a través de Prisma, un ORM moderno que facilita el acceso y manipulación de datos en PostgreSQL.

### Notas Adicionales

- LeanMarket está pensado como un proyecto integral para demostrar conocimientos en fullstack con tecnologías modernas.
- El proyecto está publicado en Vercel. **Link:** [lean-market.vercel.app](https://lean-market.vercel.app/)

---

¡Gracias por visitar este proyecto! Si tenés comentarios, sugerencias o querés colaborar, no dudes en contactarme.

📬 **Leandro Licata** – [leandro-licata-portfolio.vercel.app](https://leandro-licata-portfolio.vercel.app/)
