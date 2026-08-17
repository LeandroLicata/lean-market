import { Product } from "./product";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  /** Llega como string: en Prisma es Decimal. */
  priceAtPurchase: number | string;
  product?: Product;
}
