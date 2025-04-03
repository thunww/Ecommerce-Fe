import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "../services/productService";

// Fetch all products from API
export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getAllProducts();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch products"
      );
    }
  }
);

export const updateProductStatus = createAsyncThunk(
  "products/updateProductStatus",
  async ({ productId, status }, { rejectWithValue }) => {
    try {
      await productService.updateProductStatus(productId, status);
      return { productId, status };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update product status"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProductStatus.fulfilled, (state, action) => {
        const { productId, status } = action.payload;
        const product = state.products.find((p) => p.product_id === productId);
        if (product) {
          product.status = status;
        }
      });
  },
});

export default productSlice.reducer;
