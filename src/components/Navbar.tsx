"use client";

import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavbar } from "@/hooks/useNavbar";

export default function Navbar() {
  const { search, setSearch, isMenuOpen, toggleMenu, closeMenu, handleSearch } =
    useNavbar();

  const links = [
    { href: "/products", label: "Productos" },
    { href: "/cart", label: "Carrito" },
    { href: "/about", label: "Acerca de" },
  ];

  return (
    <nav className="bg-navbar text-primary px-4 py-7 font-bold">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <img
            src="/images/lean-market-mini.png"
            alt="Logo grande"
            className="hidden md:block h-10 mr-4"
          />

          <img
            src="/images/logo.png"
            alt="Logo pequeño"
            className="block md:hidden h-8 mr-4"
          />
        </Link>

        <form onSubmit={handleSearch} className="flex flex-1 mx-4">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full max-w-lg px-4 py-2 rounded bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Buscar
          </button>
        </form>

        <div className="hidden md:flex space-x-4">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:underline hover:text-neon-mint"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button className="md:hidden p-2" onClick={toggleMenu}>
          {isMenuOpen ? (
            <XMarkIcon className="h-6 w-6 text-primary" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-primary" />
          )}
        </button>
      </div>

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
        </div>
      )}
    </nav>
  );
}
