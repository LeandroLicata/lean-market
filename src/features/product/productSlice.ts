import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Product } from "@/types/product";

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  featuredStatus: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  status: "idle",
  featuredStatus: "idle",
};

export const fetchProducts = createAsyncThunk<Product[], string | undefined>(
  "products/fetchProducts",
  async (query) => {
    const url = query
      ? `/api/products?query=${encodeURIComponent(query)}`
      : "/api/products";
    const response = await axios.get(url);
    console.log(response.data)
    return response.data;
  }
);

export const fetchFeaturedProducts = createAsyncThunk<Product[]>(
  "products/fetchFeaturedProducts",
  async () => {
    const response = await axios.get("/api/products/random");
    return response.data;
  }
);

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.status = "succeeded";
          state.products = action.payload;
        }
      )
      .addCase(fetchProducts.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.featuredStatus = "loading";
      })
      .addCase(
        fetchFeaturedProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.featuredStatus = "succeeded";
          state.featuredProducts = action.payload;
        }
      )
      .addCase(fetchFeaturedProducts.rejected, (state) => {
        state.featuredStatus = "failed";
      });
  },
});

export default productSlice.reducer;
