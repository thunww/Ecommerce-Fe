// FE/src/api/VendorAPI/productApi.js
import axiosClient from "../axiosClient";

const productApi = {
  // Lấy danh sách sản phẩm của shop
  getProductsByShopId: (
    page = 1,
    limit = 9,
    search = "",
    categoryId = null,
    sortBy = "name"
  ) => {
    return axiosClient.get(`/vendor/shop/products`, {
      params: {
        page,
        limit,
        search,
        categoryId,
        sortBy,
      },
    });
  },

  // Lấy thông tin chi tiết sản phẩm
  getProductById: (productId) => {
    return axiosClient.get(`/products/${productId}`);
  },

  // Tạo sản phẩm mới
  createProduct: async (formData) => {
    try {
      const response = await axiosClient.post(
        "/vendor/product/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000, // 30 giây timeout cho việc upload ảnh
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật sản phẩm
  updateProduct: (productId, productData) => {
    return axiosClient.put(`/vendor/product/${productId}`, productData);
  },

  // Xóa sản phẩm
  deleteProduct: (productIds) => {
    // Nếu productIds là mảng, chuyển thành chuỗi các ID phân cách bằng dấu phẩy
    const ids = Array.isArray(productIds) ? productIds.join(",") : productIds;
    return axiosClient.delete(`/products/${ids}`);
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

  // Xóa một biến thể của sản phẩm
  deleteVariant: (productId, variantId) => {
    return axiosClient.delete(
      `/vendor/product/${productId}/variant/${variantId}`
    );
  },

  // Cập nhật sản phẩm và các biến thể (variant) kèm ảnh
  updateProductWithVariants: (productId, productData) => {
    const formData = new FormData();

    formData.append("product_name", productData.product_name);
    formData.append("description", productData.description);
    formData.append("discount", productData.discount);
    formData.append("dimensions", productData.dimensions);
    formData.append("weight", productData.weight);
    if (productData.category !== undefined) {
      formData.append("category", productData.category);
    }
    formData.append("stock", productData.stock);

    formData.append("variants", JSON.stringify(productData.variants));

    if (productData.variantImages) {
      Object.entries(productData.variantImages).forEach(([variantId, file]) => {
        if (file) {
          formData.append(`variantImage_${variantId}`, file);
        }
      });
    }

    return axiosClient.put(`/vendor/product/update/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000,
    });
  },
};

export default productApi;
