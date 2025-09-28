"use client";

import ProductsGrid from "@/components/ProductsGrid";
import useProducts from "@/hooks/useProducts";
import Pagination from "@/components/Paginations";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? undefined;
  const brandId = searchParams.get("brandId") ?? undefined;
  const minPrice = Number(searchParams.get("minPrice")) || undefined;
  const maxPrice = Number(searchParams.get("maxPrice")) || undefined;
  const page = Number(searchParams.get("page")) || 1;

  const rawSortBy = searchParams.get("sortBy");
  const sortBy =
    rawSortBy === "price" || rawSortBy === "name" ? rawSortBy : undefined;
    
  const rawOrder = searchParams.get("order");
  const order =
    rawOrder === "asc" || rawOrder === "desc" ? rawOrder : undefined;

  const { products, isLoading, currentPage, totalPages, error, refetch } =
    useProducts({
      type: "all",
      filters: { query, brandId, minPrice, maxPrice, page, sortBy, order },
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

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", String(page));
            router.push(`/products?${params.toString()}`);
          }}
        />
      )}
    </section>
  );
}
