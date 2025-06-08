import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "../services/productService";

export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getAllProducts();
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("fetchAllProducts error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
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
      console.error("updateProductStatus error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product status"
      );
    }
  }
);

export const deleteProductById = createAsyncThunk(
  "products/deleteProductById",
  async (productId, { rejectWithValue }) => {
    try {
      await productService.deleteProductById(productId);
      return productId;
    } catch (error) {
      console.error("deleteProductById error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

export const getProductById = createAsyncThunk(
  "products/getProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(productId);
      console.log("getProductById response:", response.data);
      return response.data;
    } catch (error) {
      console.error("getProductById error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product by ID"
      );
    }
  }
);

export const getProductRelated = createAsyncThunk(
  "products/getProductRelated",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await productService.getProductRelated(categoryId);
      console.log("getProductRelated response:", response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("getProductRelated error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch related products"
      );
    }
  }
);

export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (
    { keyword = "", categoryId, minPrice, maxPrice, sort, minRating } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await productService.searchProduct({
        keyword,
        categoryId,
        minPrice,
        maxPrice,
        sort,
        minRating,
      });
      // console.log("searchProducts response:", response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("searchProducts error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to search products"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    relatedProducts: [],
    searchResults: [],
    product: null,
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

      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProductStatus.fulfilled, (state, action) => {
        const { productId, status } = action.payload;
        const product = state.products.find((p) => p.product_id === productId);
        if (product) {
          product.status = status;
        }
      })
      .addCase(getProductRelated.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductRelated.fulfilled, (state, action) => {
        state.loading = false;
        state.relatedProducts = action.payload;
      })
      .addCase(getProductRelated.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteProductById.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (p) => p.product_id !== action.payload
        );
      })

      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
