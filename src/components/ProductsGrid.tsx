"use client";

import ProductCard from "./ProductCard";
import { Product } from "@/types/product";

interface ProductsGridProps {
  products: Product[];
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const ProductsGrid = ({
  products,
  isLoading,
  error,
  onRetry,
}: ProductsGridProps) => {
  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">Error: {error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Reintentar
          </button>
        )}
      </div>
    );
  }

  if (isLoading) {
    return <p className="text-center">Cargando productos...</p>;
  }

  if (!products.length) {
    return <p className="text-center">No hay productos disponibles.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {products?.map((product: Product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
};

export default ProductsGrid;
