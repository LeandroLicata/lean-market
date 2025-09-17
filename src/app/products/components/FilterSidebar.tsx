"use client";

import { useState } from "react";
import { FiFilter } from "react-icons/fi";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import useBrands from "@/hooks/useBrands";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  mobile?: boolean;
}

export default function FiltersSidebar({ mobile = false }: Props) {
  // Estado de apertura
  const [open, setOpen] = useState(!mobile ? true : false);

  const { brands, isLoading, error } = useBrands();
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryParam = searchParams.get("query") ?? "";
  const brandParam = searchParams.get("brandId") ?? "";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`products/?${params.toString()}`);
  };

  // Clases para drawer mobile vs sidebar desktop
  const baseClasses = mobile
    ? `fixed top-0 left-0 h-screen z-50 bg-gray-50 shadow-lg transform transition-transform duration-300 ${
        open ? "translate-x-0" : "-translate-x-full"
      } w-64`
    : `bg-gray-50 border-r flex flex-col h-screen transition-all duration-300 ${
        open ? "w-64" : "w-14"
      }`;

  return (
    <>
      {/* Botón flotante mobile */}
      {mobile && !open && (
        <button
          onClick={() => setOpen(true)}
          className="md:hidden fixed top-[80px] right-4 z-50 bg-white border rounded-full p-3 shadow-lg hover:bg-gray-100"
        >
          <FiFilter className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar / drawer */}
      <aside className={baseClasses}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {open && <h2 className="font-semibold text-lg">Filtros</h2>}
          <button
            onClick={() => setOpen(!open)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            {open ? <ChevronLeftIcon className="w-5 h-5" /> : <FiFilter className="w-5 h-5" />}
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
                defaultValue={queryParam}
                onChange={(e) => updateFilter("query", e.target.value)}
                className="w-full border rounded p-2"
                placeholder="Ej: notebook"
              />
            </div>

            {/* Marca */}
            <div>
              <label className="block text-sm font-medium mb-1">Marca</label>
              {isLoading ? (
                <p className="text-sm text-gray-500">Cargando...</p>
              ) : error ? (
                <p className="text-sm text-red-500">{error}</p>
              ) : (
                <select
                  value={brandParam}
                  onChange={(e) => updateFilter("brandId", e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="">Todas</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* Fondo oscuro clickeable en mobile */}
      {mobile && open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
        />
      )}
    </>
  );
}
