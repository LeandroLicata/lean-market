"use client";

import Link from "next/link";
import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useNavbar } from "@/hooks/useNavbar";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { search, setSearch, isMenuOpen, toggleMenu, closeMenu, handleSearch } =
    useNavbar();

  const { data: session } = useSession();

  const links = [
    { href: "/products", label: "Productos" },
    { href: "/cart", label: "Carrito" },
    { href: "/about", label: "Acerca de" },
  ];

  return (
    <nav className="bg-navbar text-primary px-4 py-4 font-bold">
      <div className="container mx-auto flex justify-between items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <img
            src="/images/lean-market-mini.png"
            alt="Logo grande"
            className="hidden md:block h-10"
          />
          <img
            src="/images/logo.png"
            alt="Logo pequeño"
            className="block md:hidden h-8"
          />
        </Link>

        {/* Barra de búsqueda */}
        <form onSubmit={handleSearch} className="flex flex-1 max-w-lg">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full px-3 py-2 rounded-l-md bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-bright"
          />
          <button
            type="submit"
            className="px-3 flex items-center justify-center border border-sky-bright text-sky-bright bg-transparent hover:bg-sky-bright hover:text-white rounded-r-md transition"
            aria-label="Buscar"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
        </form>

        {/* Links desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-primary hover:text-sky-bright transition"
            >
              {link.label}
            </Link>
          ))}

          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-1.5 border border-mint-bright text-mint-bright rounded-md hover:bg-mint-bright hover:text-white transition text-sm"
            >
              Cerrar sesión
            </button>
          ) : (
            <>
              <Link href="/login">
                <span className="px-4 py-1.5 border border-sky-bright text-sky-bright rounded-md hover:bg-sky-bright hover:text-white transition text-sm cursor-pointer">
                  Iniciar sesión
                </span>
              </Link>
              <Link href="/register">
                <span className="px-4 py-1.5 bg-mint-bright text-white rounded-md hover:bg-mint-hover transition text-sm cursor-pointer">
                  Registrarse
                </span>
              </Link>
            </>
          )}
        </div>

        {/* Menú móvil */}
        <button className="md:hidden p-2" onClick={toggleMenu}>
          {isMenuOpen ? (
            <XMarkIcon className="h-6 w-6 text-white" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-white" />
          )}
        </button>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block px-4 py-2 text-center hover:bg-gray-200"
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}

          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full px-4 py-2 border border-mint-bright text-mint-bright rounded-md hover:bg-mint-bright hover:text-white transition text-sm"
            >
              Cerrar sesión
            </button>
          ) : (
            <>
              <Link href="/login">
                <span className="block w-full text-center px-4 py-2 border border-sky-bright text-sky-bright rounded-md hover:bg-sky-bright hover:text-white transition text-sm">
                  Iniciar sesión
                </span>
              </Link>
              <Link href="/register">
                <span className="block w-full text-center px-4 py-2 bg-mint-bright text-white rounded-md hover:bg-mint-hover transition text-sm">
                  Registrarse
                </span>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
