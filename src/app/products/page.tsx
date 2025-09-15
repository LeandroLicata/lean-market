import { Suspense } from "react";
import ProductsClient from "./components/ProductsClient";
import FiltersSidebar from "./components/FilterSidebar";

export default function Page() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar fija en desktop */}
      <div className="hidden md:block">
        <Suspense
          fallback={
            <div className="w-64 h-screen bg-gray-50">Cargando filtros...</div>
          }
        >
          <FiltersSidebar />
        </Suspense>
      </div>

      {/* Productos */}
      <div className="flex-1">
        {/* Botón para abrir filtros en mobile */}
        <div className="md:hidden p-2 border-b">
          <FiltersSidebar mobile />
        </div>

        <Suspense
          fallback={
            <div className="flex-1 min-h-screen flex items-center justify-center">
              Cargando productos...
            </div>
          }
        >
          <ProductsClient />
        </Suspense>
      </div>
    </div>
  );
}
