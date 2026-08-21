"use client";

import Link from "next/link";
import useOrders from "@/hooks/useOrders";
import { ORDER_STATUS } from "@/lib/orderStatus";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export default function OrdersPage() {
  const { orders, isLoading, error, refetch } = useOrders({
    fetchOnMount: true,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center flex-1">
        <p className="text-lg text-gray-500">Cargando tus pedidos...</p>
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

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-4">
        <p className="text-lg text-gray-600">Todavía no hiciste pedidos</p>
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
      <h1 className="text-3xl font-semibold mb-8 text-center">Mis pedidos</h1>

      <div className="space-y-6">
        {orders.map((order) => {
          const status = ORDER_STATUS[order.status];

          return (
            <article
              key={order.id}
              className="rounded-lg border border-gray-200 bg-white p-6"
            >
              <header className="flex flex-wrap justify-between items-start gap-3 mb-4">
                <div>
                  <p className="font-semibold">
                    Pedido del {formatDate(order.createdAt)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    N° {order.id.slice(0, 8)}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}
                >
                  {status.label}
                </span>
              </header>

              <ul className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between py-2 gap-4">
                    <Link
                      href={`/products/${item.productId}`}
                      className="text-gray-700 hover:text-sky-bright transition"
                    >
                      {item.product?.name ?? "Producto"}
                      <span className="text-gray-400"> × {item.quantity}</span>
                    </Link>
                    <span className="tabular-nums shrink-0">
                      $
                      {(
                        Number(item.priceAtPurchase) * item.quantity
                      ).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between border-t mt-4 pt-4 font-semibold">
                <span>Total</span>
                <span className="text-green-600 tabular-nums">
                  ${Number(order.total).toFixed(2)}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
