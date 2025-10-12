import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Cart } from "@/types/cart";

interface CartState {
  cart: Cart | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: CartState = {
  cart: null,
  status: "idle",
};

export const fetchCart = createAsyncThunk<Cart>("cart/fetchCart", async () => {
  const response = await axios.get("/api/cart");
  return response.data;
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCart.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.cart = action.payload;
    });
    builder.addCase(fetchCart.rejected, (state) => {
      state.status = "failed";
    });
  },
});

export default cartSlice.reducer;
