// FE/src/api/VendorAPI/orderApi.js
import axiosClient from "../axiosClient";

const orderApi = {
  // Lấy tất cả đơn hàng
  getAllOrders: () => axiosClient.get('/vendor/orders'),
  
  // Lấy danh sách đơn hàng với phân trang và filter
  getOrders: (params) => axiosClient.get('/vendor/orders', { params }),
  
  // Lấy chi tiết một đơn hàng
  getOrderDetail: (orderId) => axiosClient.get(`/vendor/orders/${orderId}`),
  
  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: (orderId, status) => 
    axiosClient.put(`/vendor/orders/${orderId}/status`, { status }),
  
  // Thêm thông tin vận chuyển
  addShippingInfo: (orderId, data) => 
    axiosClient.post(`/vendor/orders/${orderId}/shipping`, data),
  
  // Lấy thống kê đơn hàng theo trạng thái
  getOrderStats: () => axiosClient.get('/vendor/order-stats'),
  
  // Hủy đơn hàng
  cancelOrder: (orderId, reason) => 
    axiosClient.put(`/vendor/orders/${orderId}/cancel`, { reason }),
};

export default orderApi;