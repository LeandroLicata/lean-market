import { configureStore } from "@reduxjs/toolkit";
import productReducer from "@/features/product/productSlice";
import brandReducer from "@/features/brand/brandSlice";
import cartReducer from "@/features/cart/cartSlice";
import orderReducer from "@/features/order/orderSlice";
import { saveGuestCart } from "@/features/cart/guestCart";

export const store = configureStore({
  reducer: {
    product: productReducer,
    brand: brandReducer,
    cart: cartReducer,
    order: orderReducer,
  },
});

// El carrito de invitado se persiste acá y en ningún otro lado: así los
// reducers quedan puros y el localStorage nunca se desincroniza del estado.
let lastPersisted: string | null = null;

store.subscribe(() => {
  const { mode, cart } = store.getState().cart;
  if (mode !== "guest") return;

  const serialized = JSON.stringify(cart.items);
  if (serialized === lastPersisted) return;

  lastPersisted = serialized;
  saveGuestCart(cart.items);
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
