"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import useCart from "@/hooks/useCart";
import useOrders from "@/hooks/useOrders";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalItems, totalPrice, isLoading, isMerging } = useCart();
  const { confirm, isConfirming } = useOrders();

  const handleConfirm = async () => {
    try {
      const order = await confirm();

      await Swal.fire({
        icon: "success",
        title: "¡Compra confirmada!",
        html: `Tu pedido quedó registrado por <b>$${Number(
          order.total
        ).toFixed(2)}</b>.<br/>Te avisamos cuando se despache.`,
        confirmButtonText: "Ver mis pedidos",
        confirmButtonColor: "#3085d6",
      });

      router.push("/orders");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "No pudimos confirmar la compra",
        // El servidor explica el motivo real, por ejemplo si se acabó el stock
        // mientras el producto estaba en el carrito.
        text:
          typeof error === "string"
            ? error
            : "Intentá de nuevo en unos minutos.",
        confirmButtonColor: "#d33",
      });
    }
  };

  // Se espera también al merge: al llegar acá recién logueado, el carrito de
  // invitado todavía se está fusionando y parecería vacío.
  if (isLoading || isMerging) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg text-gray-500">
          {isMerging ? "Recuperando tu carrito..." : "Cargando tu pedido..."}
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-lg text-gray-600">
          No hay nada para comprar todavía 🛒
        </p>
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
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-8 text-center">
        Confirmar compra
      </h1>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="font-semibold mb-4">
          Resumen ({totalItems === 1 ? "1 producto" : `${totalItems} productos`}
          )
        </h2>

        <ul className="divide-y divide-gray-100">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between py-3 gap-4">
              <span className="text-gray-700">
                {item.product?.name}
                <span className="text-gray-400"> × {item.quantity}</span>
              </span>
              <span className="font-semibold tabular-nums shrink-0">
                ${(Number(item.product?.price ?? 0) * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex justify-between border-t mt-4 pt-4 text-lg font-semibold">
          <span>Total</span>
          <span className="text-green-600 tabular-nums">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-4">
        Todavía no hay pasarela de pago: el pedido queda registrado como
        pendiente de pago y se descuenta el stock.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link
          href="/cart"
          className="text-sm text-gray-500 hover:text-sky-bright transition"
        >
          Volver al carrito
        </Link>

        <button
          onClick={handleConfirm}
          disabled={isConfirming}
          className="px-8 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-md transition"
        >
          {isConfirming ? "Confirmando..." : "Confirmar compra"}
        </button>
      </div>
    </div>
  );
}
