import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import shopService from "../services/shopService";

// Fetch all shops from API
export const fetchAllShops = createAsyncThunk(
  "shops/fetchAllShops",
  async (_, { rejectWithValue }) => {
    try {
      const response = await shopService.getAllShops();
      return response.data || []; // Trả về mảng cửa hàng từ `response.data`
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Lỗi khi lấy danh sách cửa hàng"
      );
    }
  }
);

export const getShopById = createAsyncThunk(
  "shops/getShopById",
  async (shopId, { rejectWithValue }) => {
    try {
      const response = await shopService.getShopById(shopId);
      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching shop details"
      );
    }
  }
);

export const assignStatusToShop = createAsyncThunk(
  "shops/assignStatusToShop",
  async ({ shopId, status }, { rejectWithValue }) => {
    try {
      const response = await shopService.assignStatusToShop(shopId, status);
      return { shopId, status, data: response };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error updating shop status"
      );
    }
  }
);

const shopSlice = createSlice({
  name: "shops",
  initialState: {
    shops: [],
    selectedShop: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllShops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllShops.fulfilled, (state, action) => {
        state.loading = false;
        state.shops = action.payload;
      })
      .addCase(fetchAllShops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getShopById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShopById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedShop = action.payload;
      })
      .addCase(getShopById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(assignStatusToShop.pending, (state) => {
        state.loading = true;
      })
      .addCase(assignStatusToShop.fulfilled, (state, action) => {
        state.loading = false;
        const { shopId, status } = action.payload;
        const shopIndex = state.shops.findIndex(
          (shop) => shop.shop_id === shopId
        );
        if (shopIndex !== -1) {
          state.shops[shopIndex].status = status;
        }
      })
      .addCase(assignStatusToShop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default shopSlice.reducer;
