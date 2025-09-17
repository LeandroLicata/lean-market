import { Suspense } from "react";
import ProductsClient from "./components/ProductsClient";
import FiltersSidebar from "./components/FilterSidebar";

export default function Page() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Desktop */}
      <div className="hidden md:block">
        <Suspense
          fallback={<div className="w-64 h-screen bg-gray-50">Cargando filtros...</div>}
        >
          <FiltersSidebar />
        </Suspense>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 relative">
        {/* Botón flotante para abrir filtros en mobile */}
        <div className="md:hidden fixed bottom-4 right-4 z-50">
          <Suspense fallback={null}>
            <FiltersSidebar mobile />
          </Suspense>
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
