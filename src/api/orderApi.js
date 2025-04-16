import axiosClient from "./axiosClient";

const orderApi = {
  getAllOrders: () => axiosClient.get("/orders/user"),

  getOrderById: (orderId) => axiosClient.get(`/orders/${orderId}`),

  createOrder: (orderData) => axiosClient.post("/orders/create", orderData),

  updateOrder: (orderId, orderData) =>
    axiosClient.put(`/orders/${orderId}`, orderData),

  deleteOrder: (orderId) => axiosClient.delete(`/orders/${orderId}`),
};

export default orderApi;
