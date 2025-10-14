import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Cart } from "@/types/cart";

interface CartState {
  cart: Cart | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  status: "idle",
  error: null,
};

export const fetchCart = createAsyncThunk<Cart>("cart/fetchCart", async () => {
  const response = await axios.get("/api/cart");
  return response.data;
});

export const addToCart = createAsyncThunk<
  Cart,
  { productId: string; quantity?: number }
>("cart/addToCart", async () => {
  const response = await axios.post("/api/cart");
  return response.data;
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCart.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.cart = action.payload;
    });
    builder.addCase(fetchCart.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Failed to fetch cart";
    });
    builder.addCase(addToCart.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.cart = action.payload; // el backend devuelve el carrito actualizado
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Failed to add to cart";
    });
  },
});

export default cartSlice.reducer;
