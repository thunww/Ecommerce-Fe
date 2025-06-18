import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";
import shipperService from "../services/shipperService";
// Async thunk for shipper registration
export const registerShipper = createAsyncThunk(
  "shipper/register",
  async (shipperData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(
        "/shippers/register",
        shipperData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for accepting an order
export const acceptOrder = createAsyncThunk(
  "shipper/acceptOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(
        `/shippers/sub_orders/${orderId}/accept`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for completing an order
export const completeOrder = createAsyncThunk(
  "shipper/completeOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(
        `/shippers/sub_orders/${orderId}/complete`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for getting order details
export const getOrderDetails = createAsyncThunk(
  "shipper/getOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(
        `/shippers/sub_orders/${orderId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for getting orders list
export const getOrders = createAsyncThunk(
  "shipper/getOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/shippers/sub_orders");

      console.log("API Response:", response.data);
      if (response.data.success) {
        console.log("Orders data:", response.data.data);
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for getting shipper profile
export const getShipperProfile = createAsyncThunk(
  "shipper/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/shippers/profile", {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for updating shipper avatar
export const updateAvatar = createAsyncThunk(
  "shipper/updateAvatar",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(
        "/shippers/profile/avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for updating order location
export const updateOrderLocation = createAsyncThunk(
  "shipper/updateOrderLocation",
  async ({ orderId, location }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(
        `/shippers/orders/${orderId}/location`,
        {
          latitude: location.latitude,
          longitude: location.longitude,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for updating shipper profile
export const updateShipperProfile = createAsyncThunk(
  "shipper/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      console.log("Sending profile update data:", profileData);

      const response = await axiosClient.put(
        "/shippers/profile",
        {
          vehicle_type: profileData.vehicle_type,
          license_plate: profileData.license_plate,
          phone: profileData.phone,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );

      console.log("Profile update response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Update profile error:", error.response?.data);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
      return rejectWithValue(
        error.response?.data || { message: "Cập nhật thông tin thất bại" }
      );
    }
  }
);

// Async thunk for getting detailed income
export const getDetailedIncome = createAsyncThunk(
  "shipper/getDetailedIncome",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/shippers/income/filter", {
        params: {
          startDate,
          endDate,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for getting statistics
export const getStatistics = createAsyncThunk(
  "shipper/getStatistics",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/shippers/income/filter", {
        params: {
          startDate,
          endDate,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllShippers = createAsyncThunk(
  "shipper/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await shipperService.getAllShippers();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateShipperStatus = createAsyncThunk(
  "shipper/updateStatus",
  async ({ shipperId, status }, thunkAPI) => {
    try {
      const response = await shipperService.updateShipperStatus(
        shipperId,
        status
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  shippers: [],
  loading: false,
  error: null,
  success: false,
  shipper: null,
  currentOrder: null,
  orderDetails: null,
  orders: [],
  detailedIncome: null,
  statistics: null,
};

const shipperSlice = createSlice({
  name: "shipper",
  initialState,
  reducers: {
    resetShipperState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.shipper = null;
      state.currentOrder = null;
      state.orderDetails = null;
      state.orders = [];
      state.detailedIncome = null;
      state.statistics = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getAllShippers
      .addCase(getAllShippers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllShippers.fulfilled, (state, action) => {
        state.loading = false;
        state.shippers = action.payload;
      })
      .addCase(getAllShippers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateShipperStatus
      .addCase(updateShipperStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShipperStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { shipperId, status } = action.payload;
        const shipperIndex = state.shippers.findIndex(
          (shippers) => shippers.shipper_id === shipperId
        );
        if (shipperIndex !== -1) {
          state.shops[shipperIndex].status = status;
        }
      })
      .addCase(updateShipperStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register shipper
      .addCase(registerShipper.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerShipper.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.shipper = action.payload;
      })
      .addCase(registerShipper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Đăng ký thất bại";
      })
      // Accept order
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
        state.error = action.payload?.message || "Không thể nhận đơn hàng";
      })
      // Complete order
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
        state.error =
          action.payload?.message || "Không thể hoàn thành đơn hàng";
      })
      // Get order details
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
        state.success = true;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Không thể lấy thông tin đơn hàng";
      })
      // Get orders list
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.success = true;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Không thể lấy danh sách đơn hàng";
      })
      // Get shipper profile
      .addCase(getShipperProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShipperProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.shipper = action.payload.data;
        state.error = null;
      })
      .addCase(getShipperProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Không thể lấy thông tin shipper";
      })
      // Update avatar
      .addCase(updateAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.loading = false;
        if (state.shipper) {
          state.shipper.avatar = action.payload.avatar;
        }
        state.success = true;
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Không thể cập nhật ảnh đại diện";
      })
      // Update order location
      .addCase(updateOrderLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderLocation.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentOrder) {
          state.currentOrder.location = action.payload.location;
        }
        state.success = true;
      })
      .addCase(updateOrderLocation.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Không thể cập nhật vị trí đơn hàng";
      })
      // Update shipper profile
      .addCase(updateShipperProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShipperProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.shipper = action.payload;
        state.success = true;
      })
      .addCase(updateShipperProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Không thể cập nhật hồ sơ";
      })
      // Get detailed income
      .addCase(getDetailedIncome.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDetailedIncome.fulfilled, (state, action) => {
        state.loading = false;
        state.detailedIncome = action.payload.data;
        state.statistics = action.payload.data.statistics;
        state.success = true;
      })
      .addCase(getDetailedIncome.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Không thể lấy thông tin thu nhập";
      })
      // Get statistics
      .addCase(getStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload.data.statistics;
        state.success = true;
      })
      .addCase(getStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Không thể lấy thông tin thống kê";
      });
  },
});

export const { resetShipperState } = shipperSlice.actions;
export default shipperSlice.reducer;
