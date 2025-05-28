// FE/src/api/VendorAPI/orderApi.js
import axiosClient from "../axiosClient";

const orderApi = {
  // Lấy danh sach cac don dat hang cua shop
  getAllOrders_list: (shop_id) =>
    axiosClient.get(`/shops/${shop_id}/ordered-products`),

  getAllOrders: () => axiosClient.get("/vendor/orders"),

  // Lấy danh sách đơn hàng với phân trang và filter
  getOrders: (params) => {
    const url = "/vendor/suborders";
    return axiosClient.get(url, { params });
  },

  //Lay chi tiet order theo id
  getProductById(productId) {
    try {
      const response = axiosClient.get(
        `/products/detailProducts?productId=${productId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw error;
    }
  },

  //Lay chi tiet nhieu san pham theo ids
  getProductsDetailByIds: (productIds, variantIds) => {
    try {
      const url = `/products/detailProducts?productIds=${productIds}&variantIds=${variantIds}`;
      return axiosClient.get(url);
    } catch (error) {
      console.error("Error fetching products detail by IDs:", error);
      throw error;
    }
  },

  // Lấy chi tiết một đơn hàng
  getOrderDetail: (orderId) => axiosClient.get(`/vendor/orders/${orderId}`),

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: (orderId, status) => {
    console.log(`API call: Update order ${orderId} status to ${status}`);
    // Validate inputs to prevent API errors
    if (!orderId) {
      console.error("Missing orderId in updateOrderStatus API call");
      return Promise.reject(new Error("Order ID is required"));
    }
    return axiosClient.put(`/vendor/orders/${orderId}/status`, { status });
  },

  // Thêm thông tin vận chuyển
  addShippingInfo: (orderId, data) =>
    axiosClient.post(`/vendor/orders/${orderId}/shipping`, data),

  // Lấy thống kê đơn hàng
  getOrderStats: () => axiosClient.get("/vendor/order-stats"),

  // Xử lý đơn hàng (process)
  processOrder: (productId) => {
    if (!productId) {
      return Promise.reject(new Error("Product ID is required"));
    }
    return axiosClient.post(`/vendor/products/${productId}/process`);
  },

  // Hủy đơn hàng
  cancelOrder: (orderId, reason) =>
    axiosClient.put(`/vendor/orders/${orderId}/cancel`, { reason }),

  // Cập nhật trạng thái hàng loạt cho suborder
  updateSubordersStatusToProcessing: async (subOrderIds) => {
    try {
      const url = "/vendor/orders/bulk-status"; // Endpoint to update status
      const response = await axiosClient.put(url, { subOrderIds });
      return response.data;
    } catch (error) {
      console.error("Error updating suborders status:", error);
      throw error;
    }
  },

  // Xóa hàng loạt suborder
  deleteSuborders: async (subOrderIds) => {
    try {
      const url = "/vendor/orders/bulk-delete"; // Endpoint to delete suborders
      const response = await axiosClient.delete(url, { data: { subOrderIds } }); // Use { data: ... } for DELETE with body
      return response.data;
    } catch (error) {
      console.error("Error deleting suborders:", error);
      throw error;
    }
  },

  exportOrders: async (params) => {
    try {
      const response = await axiosClient.get(
        `/vendor/orders/export?${params}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default orderApi;
