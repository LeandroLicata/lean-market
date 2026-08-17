import { Product } from "./product";

export interface CartItem {
  /**
   * Id de la fila en `CartItems`. En el carrito de invitado no hay fila, así que
   * se usa el `productId`, que también es único dentro de un carrito.
   */
  id: string;
  productId: string;
  quantity: number;
  product?: Product;
}
