import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Brand } from "@/types/brand";
import { Status } from "@/types/status";
import { ErrorState } from "@/types/error";

interface BrandState {
  brands: Brand[];
  status: Status;
  error: ErrorState;
}

const initialState: BrandState = {
  brands: [],
  status: "idle",
  error: null,
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
      state.error = null;
    });
    builder.addCase(fetchBrands.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.brands = action.payload;
      state.error = null;
    });
    builder.addCase(fetchBrands.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Error al obtener las marcas";
    });
  },
});

export default brandSlice.reducer;
