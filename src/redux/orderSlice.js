import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderService from "../services/orderService";

// Async thunk để lấy tất cả đơn hàng
export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderService.getAllOrders(); // Gọi service để lấy đơn hàng
      return response.data; // Trả về dữ liệu
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch orders");
    }
  }
);

// Async thunk để cập nhật trạng thái đơn hàng
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      return { orderId, status };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update order status"
      );
    }
  }
);

// Async thunk để xóa đơn hàng
export const deleteOrderById = createAsyncThunk(
  "orders/deleteOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      await orderService.deleteOrderById(orderId);
      return orderId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete order");
    }
  }
);

export const cancelSubOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (sub_order_id, { rejectWithValue }) => {
    try {
      await orderService.cancelSubOrder(sub_order_id); // gọi hàm hủy đơn trong service
      return sub_order_id; // trả về orderId đã hủy
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to cancel order");
    }
  }
);

// Tạo slice cho orders
const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [], // Danh sách đơn hàng
    loading: false, // Trạng thái loading
    error: null, // Lỗi nếu có
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload; // Cập nhật danh sách đơn hàng
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Lưu lỗi vào state
      })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId, status } = action.payload;
        const order = state.orders.find((o) => o.id === orderId);
        if (order) {
          order.status = status; // Cập nhật trạng thái đơn hàng
        }
      })

      .addCase(deleteOrderById.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (order) => order.id !== action.payload
        );
      })
      // ** xử lý cancelOrder **
      .addCase(cancelSubOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelSubOrder.fulfilled, (state, action) => {
        state.loading = false;
        const cancelledSubOrderId = action.payload;

        // Tìm order chứa subOrder cần huỷ
        const parentOrder = state.orders.find((order) =>
          order.subOrders?.some(
            (sub) => sub.sub_order_id === cancelledSubOrderId
          )
        );

        // Nếu tìm thấy thì cập nhật subOrder đó thành cancelled
        if (parentOrder) {
          const subOrder = parentOrder.subOrders.find(
            (sub) => sub.sub_order_id === cancelledSubOrderId
          );
          if (subOrder) {
            subOrder.status = "cancelled"; // Hoặc "canceled", tuỳ backend
          }
        }
      })

      .addCase(cancelSubOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
