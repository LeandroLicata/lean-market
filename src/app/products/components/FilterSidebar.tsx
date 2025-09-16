"use client";

import { useState } from "react";
import { FiFilter } from "react-icons/fi";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useFilters } from "@/hooks/useFilters";

interface FiltersSidebarProps {
  mobile?: boolean;
}

export default function FiltersSidebar({
  mobile = false,
}: FiltersSidebarProps) {
  const [open, setOpen] = useState(mobile ? false : true);

  const { query, setQuery, brandId, setBrandId, applyFilters } = useFilters();

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
