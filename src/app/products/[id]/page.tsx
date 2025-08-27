"use client";

import { useParams } from "next/navigation";
import useProducts from "@/hooks/useProducts";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { productDetail, isLoading, error, refetch } = useProducts({
    type: "detail",
    id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-lg animate-pulse">Cargando producto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <p className="text-red-500 font-medium">Error al cargar el producto</p>
        <button
          onClick={() => refetch(id)}
          className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!productDetail) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-lg">Producto no encontrado</p>
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Imagen */}
        <div className="flex justify-center">
          <img
            src={productDetail.image_url}
            alt={productDetail.name}
            className="w-full max-w-md rounded-2xl shadow-lg border border-gray-200"
          />
        </div>

        {/* Detalles */}
        <div>
          {/* Marca */}
          {productDetail.Brands && (
            <div className="flex items-center gap-3 mb-5">
              <img
                src={productDetail.Brands.logo_url}
                alt={productDetail.Brands.name}
                className="w-10 h-10 object-contain"
              />
              <span className="text-lg font-medium text-gray-700">
                {productDetail.Brands.name}
              </span>
            </div>
          )}

          {/* Nombre del producto */}
          <h1 className="text-4xl font-extrabold mb-4 text-gray-900">
            {productDetail.name}
          </h1>

          {/* Descripción */}
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            {productDetail.description}
          </p>

          {/* Precio */}
          <p className="text-3xl font-bold text-green-600 mb-8">
            ${productDetail.price}
            <span className="text-sm text-gray-500 ml-1">USD</span>
          </p>

          {/* Botón */}
          <button className="px-8 py-3 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md transition transform hover:scale-105">
            🛒 Agregar al carrito
          </button>
        </div>
      </div>

      {productDetail.specifications && (
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-semibold mb-4">
            Especificaciones técnicas
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {Object.entries(productDetail.specifications).map(
              ([key, value]) => (
                <li key={key}>
                  <span className="font-medium">{key}:</span> {value}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </section>
  );
}
