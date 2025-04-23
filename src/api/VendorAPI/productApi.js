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
  createProduct: (productData) => {
    console.log("productApi: Đang gọi API tạo sản phẩm");

    try {
      // Kiểm tra loại dữ liệu để ghi log
      const dataType = productData instanceof FormData ? "FormData" : "JSON";
      console.log(`Loại dữ liệu được gửi đi: ${dataType}`);

      // Log nội dung của dữ liệu
      if (dataType === "FormData") {
        console.log("Nội dung FormData:");
        for (let [key, value] of productData.entries()) {
          if (key === "variations") {
            try {
              const variations = JSON.parse(value);
              console.log(`- ${key}: `, variations);
            } catch (e) {
              console.log(`- ${key}: `, value);
            }
          } else if (value instanceof File) {
            console.log(`- ${key}: File[${value.name}] (${value.size} bytes)`);
          } else {
            console.log(`- ${key}: `, value);
          }
        }
      } else {
        console.log("Nội dung JSON:", productData);
      }

      // Gọi API với header phù hợp theo từng loại dữ liệu
      if (dataType === "FormData") {
        console.log("Gửi request với Content-Type: multipart/form-data");
        return axiosClient
          .post("/products/create", productData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            console.log("Response từ server:", response);
            return response;
          })
          .catch((error) => {
            console.error("Lỗi từ server khi gửi FormData:", error);
            if (error.response) {
              console.error("Status:", error.response.status);
              console.error("Data:", error.response.data);
              console.error("Headers:", error.response.headers);
            }
            throw error;
          });
      } else {
        console.log("Gửi request với Content-Type: application/json");
        return axiosClient
          .post("/products/create", productData)
          .then((response) => {
            console.log("Response từ server:", response);
            return response;
          })
          .catch((error) => {
            console.error("Lỗi từ server khi gửi JSON:", error);
            if (error.response) {
              console.error("Status:", error.response.status);
              console.error("Data:", error.response.data);
              console.error("Headers:", error.response.headers);
            }
            throw error;
          });
      }
    } catch (error) {
      console.error("Lỗi trước khi gửi request:", error);

      // Log chi tiết lỗi
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }

      throw error;
    }
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
