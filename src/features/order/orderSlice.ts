import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Order } from "@/types/order";
import { Status } from "@/types/status";
import { ErrorState } from "@/types/error";

interface OrderState {
  orders: Order[];
  status: Record<"confirm" | "fetch", Status>;
  error: Record<"confirm" | "fetch", ErrorState>;
}

const initialState: OrderState = {
  orders: [],
  status: {
    confirm: "idle",
    fetch: "idle",
  },
  error: {
    confirm: null,
    fetch: null,
  },
};

export const confirmOrder = createAsyncThunk<Order>(
  "orders/confirmOrder",
  async () => {
    const response = await axios.post("/api/orders/confirm");
    return response.data;
  }
);

export const getOrders = createAsyncThunk<Order[]>(
  "orders/fetchOrders",
  async () => {
    const response = await axios.get("/api/orders");
    return response.data;
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(confirmOrder.pending, (state) => {
      state.status.confirm = "loading";
      state.error.confirm = null;
    });
    builder.addCase(confirmOrder.fulfilled, (state) => {
      state.status.confirm = "succeeded";
      state.error.confirm = null;
    });
    builder.addCase(confirmOrder.rejected, (state, action) => {
      state.status.confirm = "failed";
      state.error.confirm =
        action.error.message || "Failed to confirm the order";
    });
    builder.addCase(getOrders.pending, (state) => {
      state.status.fetch = "loading";
      state.error.fetch = null;
    });
    builder.addCase(getOrders.fulfilled, (state, action) => {
      state.status.fetch = "succeeded";
      state.orders = action.payload;
      state.error.fetch = null;
    });
    builder.addCase(getOrders.rejected, (state, action) => {
      state.status.fetch = "failed";
      state.error.fetch = action.error.message || "Failed to fetch orders";
    });
  },
});

export default orderSlice.reducer;
