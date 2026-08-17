import { CartItem } from "./cartItem";

export interface Cart {
  /** `null` en el carrito de invitado y en el usuario que todavía no tiene uno. */
  id: string | null;
  items: CartItem[];
}

/** Respuesta de `/api/cart/merge` y `/api/cart/validate`. */
export interface ResolvedCart extends Cart {
  /** Mensajes listos para mostrar sobre cantidades topeadas o ítems quitados. */
  adjustments: string[];
}
