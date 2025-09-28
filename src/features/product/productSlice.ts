import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Product } from "@/types/product";

type Status = "idle" | "loading" | "succeeded" | "failed";

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  productDetail: Product | null;
  status: Record<"list" | "featured" | "detail", Status>;
  totalPages: number;
  currentPage: number;
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
  totalPages: 0,
  currentPage: 1,
};

interface FetchProductsResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
}

export interface FetchProductsArgs {
  query?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price" | "name";
  order?: "asc" | "desc";
  page?: number;
}

export const fetchProducts = createAsyncThunk<
  FetchProductsResponse,
  FetchProductsArgs
>(
  "products/fetchProducts",
  async ({ query, brandId, minPrice, maxPrice, sortBy, order, page }) => {
    const params = new URLSearchParams();

    if (query) params.append("query", query);
    if (brandId) params.append("brandId", brandId);
    if (minPrice !== undefined) params.append("minPrice", String(minPrice));
    if (maxPrice !== undefined) params.append("maxPrice", String(maxPrice));
    if (sortBy) params.append("sortBy", sortBy);
    if (order) params.append("order", order);
    if (page) params.append("page", String(page));

    const response = await axios.get(`/api/products?${params.toString()}`);
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
    builder.addCase(fetchProducts.pending, (state) => {
      state.status.list = "loading";
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.status.list = "succeeded";
      state.products = action.payload.products;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    });
    builder.addCase(fetchProducts.rejected, (state) => {
      state.status.list = "failed";
    });

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
