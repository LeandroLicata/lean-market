import { CartItem } from "@/types/cartItem";

const STORAGE_KEY = "leanmarket:guest-cart";

/**
 * Lo que se persiste en localStorage: los ítems tal cual, con una copia del
 * producto para poder pintar el carrito sin pedir nada al servidor. Esa copia
 * puede quedar vieja, así que al cargar el carrito se revalida contra
 * `/api/cart/validate`.
 */
export const loadGuestCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is CartItem =>
        typeof item?.productId === "string" &&
        Number.isInteger(item?.quantity) &&
        item.quantity > 0
    );
  } catch {
    // localStorage corrupto o deshabilitado: se arranca con el carrito vacío.
    return [];
  }
};

export const saveGuestCart = (items: CartItem[]) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Sin storage disponible el carrito vive solo en memoria.
  }
};

export const clearGuestCart = () => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nada que hacer.
  }
};

/** Solo lo que el servidor necesita para revalidar o fusionar. */
export const toPayload = (items: CartItem[]) =>
  items.map(({ productId, quantity }) => ({ productId, quantity }));
