"use client";

import Link from "next/link";
import Swal from "sweetalert2";
import useCart from "@/hooks/useCart";
import CartItemRow from "./components/CartItemRow";

export default function CartPage() {
  const {
    items,
    isGuest,
    totalItems,
    totalPrice,
    isLoading,
    isMutating,
    isMerging,
    error,
    adjustments,
    updateQuantity,
    removeFromCart,
    emptyCart,
    refetch,
    dismissAdjustments,
  } = useCart();

  const showError = (unknownError: unknown, fallback: string) => {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: typeof unknownError === "string" ? unknownError : fallback,
      confirmButtonColor: "#d33",
    });
  };

  const handleQuantityChange = async (
    productId: string,
    quantity: number
  ) => {
    try {
      await updateQuantity(productId, quantity);
    } catch (unknownError) {
      showError(unknownError, "No pudimos actualizar la cantidad.");
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await removeFromCart(productId);
    } catch (unknownError) {
      showError(unknownError, "No pudimos quitar el producto.");
    }
  };

  const handleEmptyCart = async () => {
    const { isConfirmed } = await Swal.fire({
      icon: "warning",
      title: "¿Vaciar el carrito?",
      text: "Se van a quitar todos los productos.",
      showCancelButton: true,
      confirmButtonText: "Vaciar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });
    if (!isConfirmed) return;

    try {
      await emptyCart();
    } catch (unknownError) {
      showError(unknownError, "No pudimos vaciar el carrito.");
    }
  };

  if (isLoading || isMerging) {
    return (
      <div className="flex justify-center items-center flex-1">
        <p className="text-lg text-gray-500">
          {isMerging ? "Recuperando tu carrito..." : "Cargando carrito..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center flex-1 gap-4">
        <p className="text-lg text-red-500">{error}</p>
        <button
          onClick={refetch}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-4">
        <p className="text-lg text-gray-600">Tu carrito está vacío 🛒</p>
        <Link
          href="/products"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-2 text-center">Tu Carrito</h1>
      <p className="text-center text-gray-500 mb-8">
        {totalItems === 1 ? "1 producto" : `${totalItems} productos`}
      </p>

      {adjustments.length > 0 && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4">
          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="font-semibold text-amber-800 mb-1">
                Ajustamos tu carrito
              </p>
              <ul className="list-disc list-inside text-sm text-amber-700 space-y-1">
                {adjustments.map((adjustment) => (
                  <li key={adjustment}>{adjustment}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={dismissAdjustments}
              className="text-amber-700 hover:text-amber-900 text-sm font-medium shrink-0"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {isGuest && (
        <div className="mb-6 rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800">
          Estás comprando sin cuenta.{" "}
          <Link
            href="/login?callbackUrl=%2Fcart"
            className="font-semibold underline"
          >
            Iniciá sesión
          </Link>{" "}
          para guardar tu carrito: los productos que agregaste se conservan.
        </div>
      )}

      <div className="space-y-6">
        {items.map((item) => (
          <CartItemRow
            key={item.id}
            item={item}
            disabled={isMutating}
            onQuantityChange={(quantity) =>
              handleQuantityChange(item.productId, quantity)
            }
            onRemove={() => handleRemove(item.productId)}
          />
        ))}
      </div>

      <div className="mt-10 border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          onClick={handleEmptyCart}
          disabled={isMutating}
          className="text-sm text-gray-500 hover:text-red-500 disabled:opacity-40 transition"
        >
          Vaciar carrito
        </button>

        <div className="text-right">
          <p className="text-lg font-semibold">
            Total:{" "}
            <span className="text-green-600 tabular-nums">
              ${totalPrice.toFixed(2)}
            </span>
          </p>
          <Link
            href="/checkout"
            className="inline-block mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Finalizar compra
          </Link>
        </div>
      </div>
    </div>
  );
}
