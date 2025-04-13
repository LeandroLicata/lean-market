"use client";

import PromoSlider from "./home/components/PromoSlider";
import ProductsGrid from "./home/components/ProductsGrid";
import useProducts from "@/hooks/useProducts";

export default function Home() {
  const { products, isLoading, error, refetch } = useProducts({
    type: "featured",
  });

  return (
    <div>
      <PromoSlider />
      <ProductsGrid
        products={products}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
      />
    </div>
  );
}
