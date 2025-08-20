import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Product } from "@/types/product";

type Status = "idle" | "loading" | "succeeded" | "failed";

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  productDetail: Product | null;
  status: Record<"list" | "featured" | "detail", Status>;
}

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  productDetail: null,
  status: {
    list: "idle",
    featured: "idle",
    detail: "idle",
  },
};

export const fetchProducts = createAsyncThunk<Product[], string | undefined>(
  "products/fetchProducts",
  async (query) => {
    const url = query
      ? `/api/products?query=${encodeURIComponent(query)}`
      : "/api/products";
    const response = await axios.get(url);
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

export const fetchProductDetail = createAsyncThunk<Product, string>(
  "products/fetchProductById",
  async (id) => {
    const response = await axios.get(`/api/products/${id}`);
    return response.data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ---- GET ALL PRODUCTS ----
    builder.addCase(fetchProducts.pending, (state) => {
      state.status.list = "loading";
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.status.list = "succeeded";
      state.products = action.payload;
    });
    builder.addCase(fetchProducts.rejected, (state) => {
      state.status.list = "failed";
    });

    // ---- GET FEATURED PRODUCTS ----
    builder.addCase(fetchFeaturedProducts.pending, (state) => {
      state.status.featured = "loading";
    });
    builder.addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
      state.status.featured = "succeeded";
      state.featuredProducts = action.payload;
    });
    builder.addCase(fetchFeaturedProducts.rejected, (state) => {
      state.status.featured = "failed";
    });

    // ---- GET PRODUCT DETAIL ----
    builder.addCase(fetchProductDetail.pending, (state) => {
      state.status.detail = "loading";
    });
    builder.addCase(fetchProductDetail.fulfilled, (state, action) => {
      state.status.detail = "succeeded";
      state.productDetail = action.payload;
    });
    builder.addCase(fetchProductDetail.rejected, (state) => {
      state.status.detail = "failed";
    });
  },
});

export default productSlice.reducer;
