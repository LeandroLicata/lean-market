import { OrderItem } from "./orderItem";

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  /** Llega como string: en Prisma es Decimal. */
  total: number | string;
  status: OrderStatus;
  createdAt: string;
}
