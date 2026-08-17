import { OrderStatus } from "@/types/order";

/** Etiqueta y color de cada estado, para no repetirlos en cada vista. */
export const ORDER_STATUS: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pendiente de pago",
    className: "bg-amber-100 text-amber-800",
  },
  paid: { label: "Pagado", className: "bg-green-100 text-green-800" },
  shipped: { label: "Enviado", className: "bg-sky-100 text-sky-800" },
  delivered: { label: "Entregado", className: "bg-gray-100 text-gray-700" },
  cancelled: { label: "Cancelado", className: "bg-red-100 text-red-800" },
};
