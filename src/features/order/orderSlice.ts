import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Order } from "@/types/order";

interface OrderState {
  orders: Order[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  status: "idle",
  error: null,
};

export const confirmOrder = createAsyncThunk<Order>(
  "orders/confirmOrder",
  async () => {
    const response = await axios.post("/api/orders/confirm");
    return response.data;
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(confirmOrder.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(confirmOrder.fulfilled, (state) => {
      state.status = "succeeded";
      state.error = null;
    });
    builder.addCase(confirmOrder.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Failed to confirm the order";
    });
  },
});

export default orderSlice.reducer;
