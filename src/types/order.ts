import { OrderItem } from "./orderItem";

export interface Order {
  id: string;
  userId: string;
  items: OrderItem;
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
}
