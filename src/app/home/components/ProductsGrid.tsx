"use client";
import ProductCard from "./ProductCard";
import useProducts from "@/hooks/useProducts";
import { Product } from "@/types/product";

const ProductsGrid = () => {
  const { products, isLoading } = useProducts();

  if (isLoading) {
    return <p className="text-center">Cargando productos...</p>;
  }

  if (!products.length) {
    return <p className="text-center">No hay productos disponibles.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products?.map((product: Product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
};

export default ProductsGrid;
