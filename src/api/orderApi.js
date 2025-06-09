import axiosClient from "./axiosClient";

const orderApi = {
  createOrder: async (orderData) => {
    const url = "orders/create";
    try {
      const response = await axiosClient.post(url, orderData);
      console.log("API response:", response);
      return response;
    } catch (error) {
      console.error("Lỗi khi gọi API tạo đơn hàng:", error);
      throw error;
    }
  },
  getAllOrders: () => axiosClient.get("/orders/user"),

  getOrder: (orderId) => {
    const url = `/api/v1/orders/${orderId}`;
    return axiosClient.get(url);
  },

  getUserOrders: () => {
    const url = "/api/v1/orders/user";
    return axiosClient.get(url);
  },

  cancelSubOrder: (sub_order_id) => {
    const url = `orders/cancel-suborder/${sub_order_id}`;
    return axiosClient.patch(url);
  },
};

export default orderApi;
