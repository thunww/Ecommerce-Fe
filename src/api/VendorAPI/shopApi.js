// FE/src/api/VendorAPI/shopApi.js
import axiosClient from "../axiosClient";

const shopApi = {
  // Đăng ký trở thành vendor
  registerVendor: (formData) => {
    return axiosClient.post("/vendor/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Lấy thông tin shop của vendor
  getShopInfo: () => {
    return axiosClient.get("/vendor/my-shop");
  },

  // Lấy thống kê chi tiết về shopokmbv
  getShopAnalytics: () => {
    return axiosClient.get("/vendor/shop-analytics");
  },

  // Lấy dữ liệu đánh giá của shop
  getShopRating: () => {
    return axiosClient.get("/vendor/shop/rating");
  },

  // Test API - Kiểm tra dữ liệu shop không cần auth (giữ lại để debug)
  testShopData: () => {
    return axiosClient.get("/vendor/shop-test");
  },

  // Test API - Kiểm tra authentication
  testAuth: () => {
    return axiosClient.get("/vendor/auth-test");
  },

  // Cập nhật thông tin shop
  updateShopInfo: (data) => {
    return axiosClient.put("/vendor/shop", data);
  },

  // Cập nhật logo shop
  updateShopLogo: (formData) => {
    return axiosClient.put("/vendor/shop/logo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Cập nhật banner shop
  updateShopBanner: (formData) => {
    return axiosClient.put("/vendor/shop/banner", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Lấy danh sách đánh giá của shop
  getShopReviews: (params) => {
    return axiosClient.get("/vendor/shop/reviews", { params });
  },

  // Lấy thông tin chi tiết shop của người dùng đang đăng nhập

  getMyShopDetails: () => {
    return axiosClient.get("/vendor/my-shop");
  },
};

export default shopApi;
