"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiFilter } from "react-icons/fi";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function FiltersSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(true);

  // Estado local de filtros
  const [query, setQuery] = useState(searchParams.get("query") ?? "");
  const [brandId, setBrandId] = useState(searchParams.get("brandId") ?? "");
  //   const [minPrice, setMinPrice] = useState<number>(0);
  //   const [maxPrice, setMaxPrice] = useState<number>(2000);
  //   const [sortBy, setSortBy] = useState<
  //     "price_asc" | "price_desc" | "name_asc" | "name_desc" | ""
  //   >(searchParams.get("sortBy") ?? "");

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (query) params.set("query", query);
    if (brandId) params.set("brandId", brandId);
    // if (minPrice) params.set("minPrice", String(minPrice));
    // if (maxPrice) params.set("maxPrice", String(maxPrice));
    // if (sortBy) params.set("sortBy", sortBy);

    router.push(`/products?${params.toString()}`);
  };

  return (
    <aside
      className={`${
        open ? "w-64" : "w-14"
      } bg-gray-50 border-r transition-all duration-300 flex flex-col h-screen`}
    >
      {/* Header con toggle */}
      <div className="flex items-center justify-between p-4 border-b">
        {open && <h2 className="font-semibold text-lg">Filtros</h2>}
        <button
          onClick={() => setOpen(!open)}
          className="p-1 hover:bg-gray-200 rounded"
        >
          {open ? (
            <ChevronLeftIcon className="w-5 h-5" />
          ) : (
            <FiFilter className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Contenido */}
      {open && (
        <div className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Buscar */}
          <div>
            <label className="block text-sm font-medium mb-1">Buscar</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Ej: notebook"
            />
          </div>

          {/* Marca */}
          <div>
            <label className="block text-sm font-medium mb-1">Marca</label>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Todas</option>
              <option value="asus">Asus</option>
              <option value="lenovo">Lenovo</option>
              <option value="apple">Apple</option>
            </select>
          </div>

          {/* Rango de precios */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Rango de precios
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                // value={minPrice}
                // onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-1/2 border rounded p-2"
                placeholder="Mín"
              />
              <input
                type="number"
                // value={maxPrice}
                // onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-1/2 border rounded p-2"
                placeholder="Máx"
              />
            </div>
          </div>

          {/* Ordenar por */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Ordenar por
            </label>
            <select
              //   value={sortBy}
              //   onChange={(e) => setSortBy(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Por defecto</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
              <option value="name_asc">Nombre: A-Z</option>
              <option value="name_desc">Nombre: Z-A</option>
            </select>
          </div>

          {/* Botón aplicar */}
          <button
            onClick={applyFilters}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Aplicar filtros
          </button>
        </div>
      )}
    </aside>
  );
}
