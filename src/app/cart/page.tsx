"use client";

import Image from "next/image";
import useCart from "@/hooks/useCart";

export default function CartPage() {
  const { cart, isLoading, error } = useCart();

  const totalPrice = cart?.items?.reduce(
    (acc, item) => acc + Number(item.product?.price || 0) * item.quantity,
    0
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg text-gray-500">Cargando carrito...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <p className="text-lg text-gray-600">Tu carrito está vacío 🛒</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-8 text-center">Tu Carrito</h1>

      <div className="space-y-6">
        {cart.items?.map((item) => {
          const product = item.product;
          if (!product) return null; // Evita renderizar si no hay producto

          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-200 pb-4"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={product.image_url || "/placeholder.png"}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />
                <div>
                  <h2 className="font-medium">{product.name}</h2>
                  <p className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                    {product.description}
                  </p>
                  <p className="mt-1 text-gray-700 font-semibold">
                    ${product.price}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-3 sm:mt-0">
                <p className="text-sm text-gray-600">Cantidad:</p>
                <span className="font-semibold">{item.quantity}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 border-t pt-6 text-right">
        <p className="text-lg font-semibold">
          Total:{" "}
          <span className="text-green-600">${totalPrice?.toFixed(2) ?? 0}</span>
        </p>
        <button className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
          Finalizar compra
        </button>
      </div>
    </div>
  );
}
