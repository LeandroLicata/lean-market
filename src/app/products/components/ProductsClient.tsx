"use client";

import ProductsGrid from "@/components/ProductsGrid";
import useProducts from "@/hooks/useProducts";
import { useSearchParams } from "next/navigation";

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? undefined;

  const { products, isLoading, error, refetch } = useProducts({
    type: "all",
    filters: { query },
  });

  const results = products.length;

  return (
    <section className="flex-1 px-4 sm:px-8 py-12">
      {query ? (
        <h2 className="text-2xl font-semibold text-center">
          {results} Resultados de búsqueda para &quot;{query}&quot;
        </h2>
      ) : null}

      <ProductsGrid
        products={products}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
      />
    </section>
  );
}
