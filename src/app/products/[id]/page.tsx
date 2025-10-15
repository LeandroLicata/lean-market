"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import useProducts from "@/hooks/useProducts";
import useCart from "@/hooks/useCart";
import Swal from "sweetalert2";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { productDetail, isLoading, error, refetch } = useProducts({
    type: "detail",
    id,
  });

  const { addToCart, isLoading: cartLoading } = useCart();
  const [quantity, setQuantity] = useState(1); // cantidad seleccionada

  const handleAddToCart = async () => {
    if (!productDetail) return;

    if (productDetail.stock <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Sin stock disponible",
        text: "Lo sentimos, este producto no tiene stock por el momento.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (quantity > productDetail.stock) {
      Swal.fire({
        icon: "warning",
        title: "Cantidad inválida",
        text: `Solo hay ${productDetail.stock} unidades disponibles.`,
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      await addToCart(productDetail.id, quantity);

      Swal.fire({
        icon: "success",
        title: `Agregaste ${quantity} unidad${
          quantity > 1 ? "es" : ""
        } al carrito 🛒`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo agregar el producto al carrito.",
        confirmButtonColor: "#d33",
      });
    }
  };

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
          onClick={() => refetch()}
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

  const { stock } = productDetail;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div className="flex justify-center">
          <img
            src={productDetail.image_url}
            alt={productDetail.name}
            className="w-full max-w-md rounded-2xl shadow-lg border border-gray-200"
          />
        </div>

        <div>
          {productDetail.Brands && (
            <div className="flex items-center gap-4 mb-5">
              <img
                src={productDetail.Brands.logo_url}
                alt={productDetail.Brands.name}
                className="w-14 h-14 object-contain"
              />
              <span className="text-xl font-semibold text-gray-800">
                {productDetail.Brands.name}
              </span>
            </div>
          )}

          <h1 className="text-4xl font-extrabold mb-4 text-gray-900">
            {productDetail.name}
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            {productDetail.description}
          </p>

          <p className="text-3xl font-bold text-green-600 mb-4">
            ${productDetail.price}
            <span className="text-sm text-gray-500 ml-1">USD</span>
          </p>

          <p
            className={`text-sm mb-4 ${
              stock > 0 ? "text-gray-600" : "text-red-500 font-medium"
            }`}
          >
            {stock > 0 ? `Stock disponible: ${stock}` : "Sin stock"}
          </p>

          {/* Selección de cantidad */}
          {stock > 0 && (
            <div className="mb-4 flex items-center gap-3">
              <label className="font-medium text-gray-700">Cantidad:</label>
              <input
                type="number"
                min={1}
                max={stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-20 px-3 py-2 border rounded-md text-center"
              />
            </div>
          )}

          {/* Botón agregar al carrito */}
          <button
            onClick={handleAddToCart}
            disabled={stock <= 0 || cartLoading}
            className={`px-8 py-3 flex items-center justify-center gap-2 rounded-xl shadow-md transition transform hover:scale-105 ${
              stock > 0
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            {cartLoading ? "Agregando..." : "🛒 Agregar al carrito"}
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
