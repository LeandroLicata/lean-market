import { Suspense } from "react";
import ProductsClient from "./components/ProductsClient";
import FiltersSidebar from "./components/FilterSidebar";

export default function Page() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Suspense
        fallback={
          <div className="w-64 h-screen bg-gray-50">Cargando filtros...</div>
        }
      >
        <FiltersSidebar />
      </Suspense>

      {/* Productos */}
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
  );
}
