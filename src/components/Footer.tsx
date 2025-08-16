import Link from "next/link";
import Image from "next/image";
import { EnvelopeIcon, BriefcaseIcon } from "@heroicons/react/24/outline";
import { FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-navbar text-primary py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
        {/* Logo */}
        <div className="flex items-center justify-center md:justify-start">
          <Image
            src="/images/lean-market.png"
            alt="Lean Market Logo"
            width={160}
            height={160}
          />
        </div>

        {/* Contacto */}
        <section>
          <h5 className="uppercase font-bold mb-4">Contactame</h5>
          <ul className="space-y-2">
            <li>
              <a
                href="https://www.linkedin.com/in/leandro-licata/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 justify-center md:justify-start text-sm font-medium hover:text-sky-bright transition-colors"
              >
                <FaLinkedin className="w-4 h-4" /> LinkedIn
              </a>
            </li>
            <li>
              <a
                href="mailto:leandrolicata1@gmail.com"
                className="flex items-center gap-2 justify-center md:justify-start text-sm font-medium hover:text-sky-bright transition-colors"
              >
                <EnvelopeIcon className="w-4 h-4" /> Email
              </a>
            </li>
            <li>
              <a
                href="https://leandro-licata-portfolio.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 justify-center md:justify-start text-sm font-medium hover:text-sky-bright transition-colors"
              >
                <BriefcaseIcon className="w-4 h-4" /> Portfolio
              </a>
            </li>
          </ul>
        </section>

        {/* Usuario */}
        <section>
          <h5 className="uppercase font-bold mb-4">Usuario</h5>
          <ul className="space-y-2">
            <li>
              <Link
                href="/login"
                className="text-sm font-medium hover:text-sky-bright transition-colors"
              >
                Iniciar sesión
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                className="text-sm font-medium hover:text-sky-bright transition-colors"
              >
                Registrarme
              </Link>
            </li>
          </ul>
        </section>

        {/* Navegación */}
        <section>
          <h5 className="uppercase font-bold mb-4">Navegación</h5>
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="text-sm font-medium hover:text-sky-bright transition-colors"
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/productos"
                className="text-sm font-medium hover:text-sky-bright transition-colors"
              >
                Productos
              </Link>
            </li>
            <li>
              <Link
                href="/carrito"
                className="text-sm font-medium hover:text-sky-bright transition-colors"
              >
                Carrito
              </Link>
            </li>
          </ul>
        </section>
      </div>

      {/* Copyright */}
      <div className="mt-10 border-t border-white/10 pt-4 text-center text-xs text-slate-400 space-y-2">
        <p>
          © {new Date().getFullYear()} LeanMarket. Todos los derechos
          reservados.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/terminos"
            className="hover:text-sky-bright transition-colors"
          >
            Términos y condiciones
          </Link>
          <span>|</span>
          <Link
            href="/privacidad"
            className="hover:text-sky-bright transition-colors"
          >
            Política de privacidad
          </Link>
        </div>
      </div>
    </footer>
  );
}
