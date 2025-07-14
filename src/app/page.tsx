"use client";

import PromoSlider from "./home/components/PromoSlider";
import ProductsGrid from "@/components/ProductsGrid";
import Testimonials from "./home/components/Testimonials";
import useProducts from "@/hooks/useProducts";

export default function Home() {
  const { products, isLoading, error, refetch } = useProducts({
    type: "featured",
  });

  return (
    <div>
      <PromoSlider />
      <section className="px-4 sm:px-8 py-12">
        <h2 className="text-2xl font-semibold text-center">
          Productos Destacados
        </h2>
        <ProductsGrid
          products={products}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
        />
      </section>
      <Testimonials />
    </div>
  );
}
