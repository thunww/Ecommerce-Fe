import {
  checkout,
  getOrderStatus,
  getOrderHistory,
  cancelOrder,
  trackOrder,
  getPaymentMethods,
  createPayment,
  verifyPayment,
} from "../api/cartApi";
import orderApi from "../api/orderApi";
import { message } from "antd";

const orderService = {
  getAllOrders: async () => {
    try {
      const response = await orderApi.getAllOrders();
      return response.data; // trả về dữ liệu đơn hàng
    } catch (error) {
      throw error; // ném lỗi nếu có vấn đề trong API call
    }
  },

  // Đặt hàng
  checkout: async (data) => {
    try {
      const response = await cartApi.checkout(data);
      message.success("Đặt hàng thành công");
      return response.data;
    } catch (error) {
      message.error("Lỗi khi đặt hàng");
      throw error;
    }
  },

  // Lấy trạng thái đơn hàng
  getOrderStatus: async (orderId) => {
    try {
      const response = await cartApi.getOrderStatus(orderId);
      return response.data;
    } catch (error) {
      message.error("Lỗi khi lấy trạng thái đơn hàng");
      throw error;
    }
  },

  // Lấy lịch sử đơn hàng
  getOrderHistory: async () => {
    try {
      const response = await cartApi.getOrderHistory();
      return response.data;
    } catch (error) {
      message.error("Lỗi khi lấy lịch sử đơn hàng");
      throw error;
    }
  },

  // Hủy đơn hàng
  cancelSubOrder: async (sub_order_id) => {
    try {
      await orderApi.cancelSubOrder(sub_order_id);
      message.success("Đã hủy đơn hàng");
    } catch (error) {
      message.error("Lỗi khi hủy đơn hàng");
      throw error;
    }
  },

  // Theo dõi đơn hàng
  trackOrder: async (orderId) => {
    try {
      const response = await cartApi.trackOrder(orderId);
      return response.data;
    } catch (error) {
      message.error("Lỗi khi theo dõi đơn hàng");
      throw error;
    }
  },
};

export default orderService;
