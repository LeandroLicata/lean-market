import Link from "next/link";

export default function Navbar() {
  const links = [
    { href: "/products", label: "Productos" },
    { href: "/cart", label: "Carrito" },
    { href: "/about", label: "Acerca de" },
  ];

  return (
    <nav className="bg-navbar text-primary p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img
            src="/images/lean-market-mini.png"
            alt="Logo"
            className="h-10 mr-4"
          />
        </div>

        <div className="flex-1 mx-4">
          <input
            type="search"
            placeholder="Buscar..."
            className="w-[600px] px-4 py-2 rounded bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-x-4">
          {links.map((link) => (
            <Link key={link.label} href={link.href} className="hover:underline">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
