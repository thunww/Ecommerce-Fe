// FE/src/api/VendorAPI/productApi.js
import axiosClient from "../axiosClient";

const productApi = {
  // Lấy danh sách sản phẩm của shop
  getProductsByShopId: (shopId) => {
    // Có thể backend sử dụng đường dẫn khác, thử với một số endpoint phổ biến
    return axiosClient.get("/vendor/my-products");
  },

  // Lấy thông tin chi tiết sản phẩm
  getProductById: (productId) => {
    return axiosClient.get(`/vendor/product/${productId}`);
  },

  // Tạo sản phẩm mới
  createProduct: (productData) => {
    return axiosClient.post("/vendor/product", productData);
  },

  // Cập nhật sản phẩm
  updateProduct: (productId, productData) => {
    return axiosClient.put(`/vendor/product/${productId}`, productData);
  },

  // Xóa sản phẩm
  deleteProduct: (productId) => {
    return axiosClient.delete(`/vendor/product/${productId}`);
  },

  // Upload ảnh sản phẩm
  uploadProductImage: (productId, formData) => {
    return axiosClient.post(`/vendor/product/${productId}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Lấy danh sách sản phẩm theo bộ lọc
  getFilteredProducts: (shopId, params) => {
    return axiosClient.get(`/vendor/products/filter`, { params });
  },

  // Cập nhật số lượng hàng tồn kho
  updateStock: (productId, stockData) => {
    return axiosClient.patch(`/vendor/product/${productId}/stock`, stockData);
  },

  // Cập nhật trạng thái sản phẩm (active, inactive)
  updateStatus: (productId, statusData) => {
    return axiosClient.patch(`/vendor/product/${productId}/status`, statusData);
  },

  // Lấy thống kê sản phẩm
  getProductStats: (shopId) => {
    return axiosClient.get(`/vendor/products/stats`);
  },

  // Xử lý vi phạm của sản phẩm
  handleViolation: (productId, responseData) => {
    return axiosClient.post(
      `/vendor/product/${productId}/violation`,
      responseData
    );
  },

  // Lấy danh sách danh mục sản phẩm
  getCategories: () => {
    return axiosClient.get("/vendor/categories");
  },
};

export default productApi;
