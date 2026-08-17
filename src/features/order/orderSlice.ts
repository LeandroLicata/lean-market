import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Order } from "@/types/order";
import { Status } from "@/types/status";
import { ErrorState } from "@/types/error";

interface OrderState {
  orders: Order[];
  /** Última orden confirmada, para la pantalla de éxito. */
  lastOrder: Order | null;
  status: Record<"confirm" | "fetch", Status>;
  error: Record<"confirm" | "fetch", ErrorState>;
}

const initialState: OrderState = {
  orders: [],
  lastOrder: null,
  status: {
    confirm: "idle",
    fetch: "idle",
  },
  error: {
    confirm: null,
    fetch: null,
  },
};

/** Prioriza el mensaje del servidor, que ya viene en español. */
const asMessage = (error: unknown, fallback: string) =>
  axios.isAxiosError(error) && typeof error.response?.data?.error === "string"
    ? error.response.data.error
    : fallback;

export const confirmOrder = createAsyncThunk<
  Order,
  void,
  { rejectValue: string }
>("orders/confirmOrder", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<Order>("/api/orders/confirm");
    return data;
  } catch (error) {
    return rejectWithValue(
      asMessage(error, "No pudimos confirmar la compra")
    );
  }
});

export const getOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("orders/fetchOrders", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<Order[]>("/api/orders");
    return data;
  } catch (error) {
    return rejectWithValue(asMessage(error, "No pudimos cargar tus pedidos"));
  }
});

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(confirmOrder.pending, (state) => {
      state.status.confirm = "loading";
      state.error.confirm = null;
    });
    builder.addCase(confirmOrder.fulfilled, (state, action) => {
      state.status.confirm = "succeeded";
      state.error.confirm = null;
      state.lastOrder = action.payload;
      state.orders.unshift(action.payload);
    });
    builder.addCase(confirmOrder.rejected, (state, action) => {
      state.status.confirm = "failed";
      state.error.confirm =
        action.payload ?? "Failed to confirm the order";
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
      state.error.fetch = action.payload ?? "Failed to fetch orders";
    });
  },
});

export default orderSlice.reducer;
