import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Brand } from "@/types/brand";

interface BrandState {
  brands: Brand[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: BrandState = {
  brands: [],
  status: "idle",
};

export const fetchBrands = createAsyncThunk<Brand[]>(
  "brands/fetchBrands",
  async () => {
    const response = await axios.get("/api/brands");
    return response.data;
  }
);

const brandSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBrands.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchBrands.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.brands = action.payload;
    });
    builder.addCase(fetchBrands.rejected, (state) => {
      state.status = "failed";
    });
  },
});

export default brandSlice.reducer;
