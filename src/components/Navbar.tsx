import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-deep-blue text-aqua-mist p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="/images/lean-market-mini.png" alt="Logo" className="h-10" />
        </div>

        <div className="flex-1 mx-4">
          <input
            type="search"
            placeholder="Buscar..."
            className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-x-4">
          <Link href="/home" className="hover:text-blue-400">
            Inicio
          </Link>
          <Link href="/about" className="hover:text-blue-400">
            Nosotros
          </Link>
          <Link href="/contact" className="hover:text-blue-400">
            Contacto
          </Link>
        </div>
      </div>
    </nav>
  );
}
