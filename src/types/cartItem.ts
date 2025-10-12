import { Product } from "./product";

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product?: Product;
}
