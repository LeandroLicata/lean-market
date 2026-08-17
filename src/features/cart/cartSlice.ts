import {
  createSlice,
  createAsyncThunk,
  isFulfilled,
  isPending,
  isRejected,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { Cart, ResolvedCart } from "@/types/cart";
import { CartItem } from "@/types/cartItem";
import { Product } from "@/types/product";
import { Status } from "@/types/status";
import { ErrorState } from "@/types/error";

/** `guest` guarda el carrito en localStorage; `user`, en la DB. */
type CartMode = "guest" | "user";

type Operation = "fetch" | "mutate" | "merge";

interface CartState {
  cart: Cart;
  mode: CartMode;
  /**
   * En modo invitado, si ya se leyó el localStorage. Hasta que sea `true` el
   * carrito no se persiste: si no, el estado inicial vacío pisaría lo guardado
   * antes de poder cargarlo.
   */
  hydrated: boolean;
  /** Ajustes por stock del último validate o merge, listos para mostrar. */
  adjustments: string[];
  status: Record<Operation, Status>;
  error: Record<Operation, ErrorState>;
}

const EMPTY_CART: Cart = { id: null, items: [] };

const initialState: CartState = {
  // Arranca vacío incluso para el invitado: el localStorage se lee en un efecto
  // del cliente para no romper la hidratación.
  cart: EMPTY_CART,
  mode: "guest",
  hydrated: false,
  adjustments: [],
  status: { fetch: "idle", mutate: "idle", merge: "idle" },
  error: { fetch: null, mutate: null, merge: null },
};

/** Prioriza el mensaje del servidor, que ya viene en español. */
const asMessage = (error: unknown, fallback: string) =>
  axios.isAxiosError(error) && typeof error.response?.data?.error === "string"
    ? error.response.data.error
    : fallback;

export const fetchCart = createAsyncThunk<Cart, void, { rejectValue: string }>(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<Cart>("/api/cart");
      return data;
    } catch (error) {
      return rejectWithValue(asMessage(error, "No pudimos cargar tu carrito"));
    }
  }
);

export const addItem = createAsyncThunk<
  Cart,
  { productId: string; quantity?: number },
  { rejectValue: string }
>("cart/addItem", async ({ productId, quantity = 1 }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<Cart>("/api/cart", {
      productId,
      quantity,
    });
    return data;
  } catch (error) {
    return rejectWithValue(
      asMessage(error, "No pudimos agregar el producto al carrito")
    );
  }
});

export const updateItem = createAsyncThunk<
  Cart,
  { productId: string; quantity: number },
  { rejectValue: string }
>("cart/updateItem", async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const { data } = await axios.patch<Cart>("/api/cart", {
      productId,
      quantity,
    });
    return data;
  } catch (error) {
    return rejectWithValue(
      asMessage(error, "No pudimos actualizar la cantidad")
    );
  }
});

export const removeItem = createAsyncThunk<
  Cart,
  { productId: string },
  { rejectValue: string }
>("cart/removeItem", async ({ productId }, { rejectWithValue }) => {
  try {
    const { data } = await axios.delete<Cart>("/api/cart", {
      params: { productId },
    });
    return data;
  } catch (error) {
    return rejectWithValue(asMessage(error, "No pudimos quitar el producto"));
  }
});

export const clearCart = createAsyncThunk<Cart, void, { rejectValue: string }>(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete<Cart>("/api/cart");
      return data;
    } catch (error) {
      return rejectWithValue(asMessage(error, "No pudimos vaciar el carrito"));
    }
  }
);

/** Revalida el carrito de invitado contra el stock y los precios actuales. */
export const validateGuestCart = createAsyncThunk<
  ResolvedCart,
  { items: { productId: string; quantity: number }[] },
  { rejectValue: string }
>("cart/validateGuestCart", async ({ items }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<ResolvedCart>("/api/cart/validate", {
      items,
    });
    return data;
  } catch (error) {
    return rejectWithValue(asMessage(error, "No pudimos revisar tu carrito"));
  }
});

/** Fusiona el carrito de invitado con el de la cuenta al iniciar sesión. */
export const mergeGuestCart = createAsyncThunk<
  ResolvedCart,
  { items: { productId: string; quantity: number }[] },
  { rejectValue: string }
>("cart/mergeGuestCart", async ({ items }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<ResolvedCart>("/api/cart/merge", {
      items,
    });
    return data;
  } catch (error) {
    return rejectWithValue(
      asMessage(error, "No pudimos recuperar el carrito que tenías sin cuenta")
    );
  }
});

/** Thunks que modifican el carrito del usuario autenticado. */
const mutations = [addItem, updateItem, removeItem, clearCart] as const;

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    modeChanged(state, action: PayloadAction<CartMode>) {
      if (state.mode === action.payload) return;
      state.mode = action.payload;
      state.cart = EMPTY_CART;
      state.hydrated = false;
      state.status = { fetch: "idle", mutate: "idle", merge: "idle" };
      state.error = { fetch: null, mutate: null, merge: null };
    },

    /** Carga inicial del carrito de invitado desde localStorage. */
    guestCartHydrated(state, action: PayloadAction<CartItem[]>) {
      state.cart = { id: null, items: action.payload };
      state.hydrated = true;
    },

    guestItemAdded(
      state,
      action: PayloadAction<{ product: Product; quantity: number }>
    ) {
      const { product, quantity } = action.payload;
      const existing = state.cart.items.find(
        (item) => item.productId === product.id
      );
      // Se topea con el stock que conocemos; el servidor lo revalida igual.
      const desired = (existing?.quantity ?? 0) + quantity;
      const next = Math.min(desired, product.stock);

      if (existing) {
        existing.quantity = next;
        existing.product = product;
      } else {
        state.cart.items.push({
          id: product.id,
          productId: product.id,
          quantity: next,
          product,
        });
      }
    },

    guestItemUpdated(
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) {
      const { productId, quantity } = action.payload;

      if (quantity <= 0) {
        state.cart.items = state.cart.items.filter(
          (item) => item.productId !== productId
        );
        return;
      }

      const item = state.cart.items.find(
        (current) => current.productId === productId
      );
      if (!item) return;

      const stock = item.product?.stock;
      item.quantity = stock ? Math.min(quantity, stock) : quantity;
    },

    guestItemRemoved(state, action: PayloadAction<string>) {
      state.cart.items = state.cart.items.filter(
        (item) => item.productId !== action.payload
      );
    },

    guestCartCleared(state) {
      state.cart = EMPTY_CART;
    },

    adjustmentsCleared(state) {
      state.adjustments = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.status.fetch = "succeeded";
      state.cart = action.payload;
    });

    builder.addCase(validateGuestCart.fulfilled, (state, action) => {
      const { adjustments, ...cart } = action.payload;
      state.status.fetch = "succeeded";
      state.cart = cart;
      state.adjustments = adjustments;
    });

    builder.addCase(mergeGuestCart.pending, (state) => {
      state.status.merge = "loading";
      state.error.merge = null;
    });
    builder.addCase(mergeGuestCart.fulfilled, (state, action) => {
      const { adjustments, ...cart } = action.payload;
      state.status.merge = "succeeded";
      state.cart = cart;
      state.adjustments = adjustments;
    });
    builder.addCase(mergeGuestCart.rejected, (state, action) => {
      state.status.merge = "failed";
      state.error.merge = action.payload ?? "No pudimos fusionar tu carrito";
    });

    // Las mutaciones comparten forma, así que se agrupan en vez de repetir
    // seis pares de casos idénticos.
    builder.addMatcher(isPending(fetchCart, validateGuestCart), (state) => {
      state.status.fetch = "loading";
      state.error.fetch = null;
    });
    builder.addMatcher(
      isRejected(fetchCart, validateGuestCart),
      (state, action) => {
        state.status.fetch = "failed";
        state.error.fetch = action.payload ?? "No pudimos cargar tu carrito";
      }
    );

    builder.addMatcher(isPending(...mutations), (state) => {
      state.status.mutate = "loading";
      state.error.mutate = null;
    });
    builder.addMatcher(isFulfilled(...mutations), (state, action) => {
      state.status.mutate = "succeeded";
      state.cart = action.payload;
    });
    builder.addMatcher(isRejected(...mutations), (state, action) => {
      state.status.mutate = "failed";
      state.error.mutate = action.payload ?? "No pudimos actualizar el carrito";
    });
  },
});

export const {
  modeChanged,
  guestCartHydrated,
  guestItemAdded,
  guestItemUpdated,
  guestItemRemoved,
  guestCartCleared,
  adjustmentsCleared,
} = cartSlice.actions;

export default cartSlice.reducer;
