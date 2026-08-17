import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from "@/server/handlers/cart";

export const GET = getCart;
export const POST = addToCart;
export const PATCH = updateCartItem;
export const DELETE = removeFromCart;
