"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiFilter } from "react-icons/fi";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

interface FiltersSidebarProps {
  mobile?: boolean;
}

export default function FiltersSidebar({
  mobile = false,
}: FiltersSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(mobile ? false : true);

  // Estado local de filtros
  const [query, setQuery] = useState(searchParams.get("query") ?? "");
  const [brandId, setBrandId] = useState(searchParams.get("brandId") ?? "");

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (brandId) params.set("brandId", brandId);

    router.push(`/products?${params.toString()}`);
    if (mobile) setOpen(false); // cerrar al aplicar
  };

  // 🔹 Render para mobile (modal)
  if (mobile) {
    return (
      <>
        {/* Botón abrir */}
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded md:hidden"
        >
          <FiFilter className="w-5 h-5" />
          Filtros
        </button>

        {open && (
          <div className="fixed inset-0 z-50 flex">
            {/* Overlay oscuro */}
            <div
              onClick={() => setOpen(false)}
              className="flex-1 bg-black/50"
            />

            {/* Panel lateral */}
            <aside className="w-72 bg-gray-50 border-l h-full flex flex-col animate-slide-in">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-semibold text-lg">Filtros</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Contenido */}
              <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                {/* Buscar */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Buscar
                  </label>
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
                  <label className="block text-sm font-medium mb-1">
                    Marca
                  </label>
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

                {/* Botón aplicar */}
                <button
                  onClick={applyFilters}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                  Aplicar filtros
                </button>
              </div>
            </aside>
          </div>
        )}
      </>
    );
  }

  // 🔹 Render para desktop (sidebar fija)
  return (
    <aside
      className={`${
        open ? "w-64" : "w-14"
      } bg-gray-50 border-r transition-all duration-300 flex flex-col h-screen`}
    >
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
