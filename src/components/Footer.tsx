import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-navbar text-primary py-6 border-t border-gray-700 p-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center pb-2">
          <Image
            src="/images/lean-market.png"
            alt="Lean Market Logo"
            width={200}
            height={200}
          />
        </div>

        {/* Contacto */}
        <section>
          <h5 className="uppercase font-bold mb-4 mt-7">Contactame</h5>
          <ul className="space-y-2">
            <li>
              <a
                href="https://linkedin.com/in/tuusuario"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover:underline"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="mailto:leandro@email.com"
                className="text-sm font-medium hover:underline"
              >
                Email
              </a>
            </li>
            <li>
              <a
                href="https://leandro-licata-portfolio.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover:underline"
              >
                Portfolio
              </a>
            </li>
          </ul>
        </section>

        {/* Usuario */}
        <section>
          <h5 className="uppercase font-bold mb-4 mt-7">Usuario</h5>
          <ul className="space-y-2">
            <li>
              <Link
                href="/login"
                className="text-sm font-medium hover:underline"
              >
                Iniciar sesión
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                className="text-sm font-medium hover:underline"
              >
                Registrarme
              </Link>
            </li>
          </ul>
        </section>

        {/* Navegación */}
        <section>
          <h5 className="uppercase font-bold mb-4 mt-7">Navegación</h5>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-sm font-medium hover:underline">
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/productos"
                className="text-sm font-medium hover:underline"
              >
                Productos
              </Link>
            </li>
            <li>
              <Link
                href="/carrito"
                className="text-sm font-medium hover:underline"
              >
                Carrito
              </Link>
            </li>
          </ul>
        </section>
      </div>

      {/* Subfooter */}
      <div className="mt-10 border-t border-gray-600 pt-4 text-center text-sm text-gray-400 space-y-2">
        <p>
          © {new Date().getFullYear()} LeanMarket. Todos los derechos
          reservados.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/terminos" className="hover:underline">
            Términos y condiciones
          </Link>
          <span>|</span>
          <Link href="/privacidad" className="hover:underline">
            Política de privacidad
          </Link>
        </div>
      </div>
    </footer>
  );
}
