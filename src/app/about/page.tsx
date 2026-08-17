import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Acerca de | LeanMarket",
  description:
    "Qué es LeanMarket, cómo está construido y quién lo desarrolla.",
};

const stack = [
  { name: "Next.js 15", detail: "App Router, frontend y API en el mismo proyecto" },
  { name: "TypeScript", detail: "Tipado de punta a punta" },
  { name: "PostgreSQL + Prisma", detail: "Base de datos en Supabase" },
  { name: "NextAuth", detail: "Autenticación por credenciales con sesión JWT" },
  { name: "Redux Toolkit", detail: "Estado del carrito y de los pedidos" },
  { name: "TailwindCSS", detail: "Estilos y diseño responsive" },
];

const features = [
  "Catálogo con búsqueda, filtros por marca y precio, y paginación",
  "Carrito que funciona sin cuenta y se conserva al iniciar sesión",
  "Control de stock en el servidor, con la compra dentro de una transacción",
  "Registro, inicio de sesión y rutas protegidas",
  "Historial de pedidos con su estado",
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-6">Acerca de LeanMarket</h1>

      <p className="text-gray-700 leading-relaxed mb-4">
        LeanMarket es una tienda de electrónica y accesorios tecnológicos
        —consolas, auriculares, televisores, teléfonos y notebooks— construida
        íntegramente con Next.js: el frontend y la API viven en el mismo
        proyecto.
      </p>
      <p className="text-gray-700 leading-relaxed mb-10">
        Es un proyecto de portfolio, así que el foco está tanto en lo que se ve
        como en lo que pasa detrás: validaciones del lado del servidor, control
        de stock y una compra que no puede quedar a medias.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Qué se puede hacer</h2>
        <ul className="space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex gap-3 text-gray-700">
              <span className="text-mint-bright font-bold shrink-0">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Cómo está hecho</h2>
        <dl className="grid sm:grid-cols-2 gap-4">
          {stack.map((item) => (
            <div
              key={item.name}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <dt className="font-semibold">{item.name}</dt>
              <dd className="text-sm text-gray-600 mt-1">{item.detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Sobre la compra</h2>
        <p className="text-gray-700 leading-relaxed">
          Todavía no hay pasarela de pago integrada: al confirmar, el pedido
          queda registrado como pendiente de pago y se descuenta el stock. Es el
          próximo paso del proyecto.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Quién lo desarrolla</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Lo desarrolla Leandro Licata. Podés ver más trabajos en el{" "}
          <a
            href="https://leandro-licata-portfolio.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-bright font-medium underline"
          >
            portfolio
          </a>{" "}
          o escribir por{" "}
          <a
            href="https://www.linkedin.com/in/leandro-licata/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-bright font-medium underline"
          >
            LinkedIn
          </a>
          .
        </p>
        <Link
          href="/products"
          className="inline-block mt-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          Ver los productos
        </Link>
      </section>
    </div>
  );
}
