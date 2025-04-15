import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Sử dụng biến môi trường hoặc giá trị mặc định
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Async thunks
export const registerShipper = createAsyncThunk(
  'shipper/register',
  async (shipperData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/shippers/register`, shipperData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Đăng ký thất bại');
    }
  }
);

export const getShipperProfile = createAsyncThunk(
  'shipper/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/shippers/profile`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lấy thông tin thất bại');
    }
  }
);

export const updateShipperProfile = createAsyncThunk(
  'shipper/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/api/shippers/profile`, profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Cập nhật thông tin thất bại');
    }
  }
);

export const updateAvatar = createAsyncThunk(
  'shipper/updateAvatar',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/api/shippers/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Cập nhật ảnh đại diện thất bại');
    }
  }
);

export const updateOrderLocation = createAsyncThunk(
  'shipper/updateLocation',
  async (locationData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/api/shippers/location`, locationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Cập nhật vị trí thất bại');
    }
  }
);

export const getOrders = createAsyncThunk(
  'shipper/getOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/shippers/orders`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lấy danh sách đơn hàng thất bại');
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  'shipper/getOrderDetails',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/shippers/orders/${orderId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lấy thông tin đơn hàng thất bại');
    }
  }
);

export const acceptOrder = createAsyncThunk(
  'shipper/acceptOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/shippers/orders/${orderId}/accept`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Nhận đơn hàng thất bại');
    }
  }
);

export const completeOrder = createAsyncThunk(
  'shipper/completeOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/shippers/orders/${orderId}/complete`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Hoàn thành đơn hàng thất bại');
    }
  }
);

export const getIncomeStats = createAsyncThunk(
  'shipper/getIncomeStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/shippers/income`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lấy thống kê thu nhập thất bại');
    }
  }
);

export const getDetailedIncome = createAsyncThunk(
  'shipper/getDetailedIncome',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/shippers/income/detailed`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lấy chi tiết thu nhập thất bại');
    }
  }
);

export const getStatistics = createAsyncThunk(
  'shipper/getStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/shippers/statistics`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lấy thống kê thất bại');
    }
  }
);

const initialState = {
  profile: null,
  orders: [],
  currentOrder: null,
  incomeStats: null,
  detailedIncome: null,
  statistics: null,
  loading: false,
  error: null,
  success: false,
};

const shipperSlice = createSlice({
  name: 'shipper',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerShipper.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerShipper.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerShipper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Profile
      .addCase(getShipperProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShipperProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getShipperProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateShipperProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShipperProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.success = true;
      })
      .addCase(updateShipperProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Avatar
      .addCase(updateAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.success = true;
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Location
      .addCase(updateOrderLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = {
          ...state.profile,
          currentLocation: action.payload
        };
        state.success = true;
      })
      .addCase(updateOrderLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Orders
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Order Details
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Accept Order
      .addCase(acceptOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.success = true;
      })
      .addCase(acceptOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Complete Order
      .addCase(completeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.success = true;
      })
      .addCase(completeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Income Stats
      .addCase(getIncomeStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIncomeStats.fulfilled, (state, action) => {
        state.loading = false;
        state.incomeStats = action.payload;
      })
      .addCase(getIncomeStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Detailed Income
      .addCase(getDetailedIncome.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDetailedIncome.fulfilled, (state, action) => {
        state.loading = false;
        state.detailedIncome = action.payload;
      })
      .addCase(getDetailedIncome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Statistics
      .addCase(getStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(getStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, resetState } = shipperSlice.actions;
export default shipperSlice.reducer; 