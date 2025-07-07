"use client";

import ProductsGrid from "@/components/ProductsGrid";
import useProducts from "@/hooks/useProducts";

export default function ProductsPage() {
  const { products, isLoading, error, refetch } = useProducts();
  const results = !products?.length ? 0 : products?.length;

  return (
    <div>
      <section className="px-4 sm:px-8 py-12">
        <h2 className="text-2xl font-semibold text-center">
          {results} Resultados de búsqueda{" "}
        </h2>
        <ProductsGrid
          products={products}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
        />
      </section>
    </div>
  );
}
