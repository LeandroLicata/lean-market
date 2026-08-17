"use client";

import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import useCart from "@/hooks/useCart";

type Props = {
  className?: string;
  onClick?: () => void;
};

export default function CartLink({ className = "", onClick }: Props) {
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      onClick={onClick}
      className={`flex items-center gap-2 text-primary hover:text-sky-bright transition ${className}`}
    >
      <span className="relative">
        <ShoppingCartIcon className="h-6 w-6" />
        {totalItems > 0 && (
          <span
            className="absolute -top-2 -right-2 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-mint-bright text-white text-xs font-bold"
            aria-hidden
          >
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </span>
      <span>
        Carrito
        {/* El conteo también va en texto, que es lo que lee un lector de pantalla. */}
        {totalItems > 0 && (
          <span className="sr-only">
            {totalItems === 1 ? ", 1 producto" : `, ${totalItems} productos`}
          </span>
        )}
      </span>
    </Link>
  );
}
