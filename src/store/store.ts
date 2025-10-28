import { configureStore } from "@reduxjs/toolkit";
import productReducer from "@/features/product/productSlice";
import brandReducer from "@/features/brand/brandSlice";
import cartReducer from "@/features/cart/cartSlice";
import orderReducer from "@/features/order/orderSlice";

export const store = configureStore({
  reducer: {
    product: productReducer,
    brand: brandReducer,
    cart: cartReducer,
    order: orderReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
