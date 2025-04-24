// FE/src/api/VendorAPI/productApi.js
import axiosClient from "../axiosClient";

const productApi = {
  // Lấy danh sách sản phẩm của shop
  getProductsByShopId: (shopId) => {
    // Sửa để lấy sản phẩm của shop hiện tại (token đã có thông tin vendor)
    return axiosClient.get("/vendor/shop/products");
  },

  // Lấy thông tin chi tiết sản phẩm
  getProductById: (productId) => {
    return axiosClient.get(`/vendor/product/${productId}`);
  },

  // Tạo sản phẩm mới
  createProduct: (formData) => {
    return axiosClient.post("/products/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000, // Tăng timeout lên 30s vì có upload ảnh
    });
  },

  // Cập nhật sản phẩm
  updateProduct: (productId, productData) => {
    return axiosClient.put(`/vendor/product/${productId}`, productData);
  },

  // Xóa sản phẩm
  deleteProduct: (productId) => {
    return axiosClient.delete(`/products/${productId}`);
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
  getCategories: (skipCache = false) => {
    // Thêm tham số ngẫu nhiên để vượt qua cache nếu cần
    const url = skipCache
      ? `/vendor/shop/category?nocache=${new Date().getTime()}`
      : "/vendor/shop/category";

    return axiosClient.get(url);
  },
};

export default productApi;
