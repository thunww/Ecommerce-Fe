import productApi from "../api/VendorAPI/productApi";

const productService = {
  // Lấy danh sách sản phẩm theo shopId
  getProductsByShopId: async (shopId) => {
    try {
      console.log("Đang gọi API lấy danh sách sản phẩm...");
      const response = await productApi.getProductsByShopId(shopId);
      console.log("Kết quả API sản phẩm:", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching products by shopId:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
      throw error;
    }
  },

  // Lấy chi tiết sản phẩm theo ID
  getProductById: async (productId) => {
    try {
      const response = await productApi.getProductById(productId);
      return response.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw error;
    }
  },

  // Tạo sản phẩm mới
  createProduct: async (productData) => {
    try {
      const response = await productApi.createProduct(productData);
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  // Cập nhật sản phẩm
  updateProduct: async (productId, productData) => {
    try {
      const response = await productApi.updateProduct(productId, productData);
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  // Xóa sản phẩm
  deleteProduct: async (productId) => {
    try {
      const response = await productApi.deleteProduct(productId);
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  // Upload ảnh sản phẩm
  uploadProductImage: async (productId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await productApi.uploadProductImage(productId, formData);
      return response.data;
    } catch (error) {
      console.error("Error uploading product image:", error);
      throw error;
    }
  },

  // Lấy sản phẩm theo bộ lọc
  getFilteredProducts: async (shopId, filters) => {
    try {
      const response = await productApi.getFilteredProducts(shopId, filters);
      return response.data;
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      throw error;
    }
  },

  // Cập nhật số lượng tồn kho
  updateStock: async (productId, quantity) => {
    try {
      const response = await productApi.updateStock(productId, { quantity });
      return response.data;
    } catch (error) {
      console.error("Error updating stock:", error);
      throw error;
    }
  },

  // Cập nhật trạng thái sản phẩm
  updateStatus: async (productId, status) => {
    try {
      const response = await productApi.updateStatus(productId, { status });
      return response.data;
    } catch (error) {
      console.error("Error updating product status:", error);
      throw error;
    }
  },

  // Lấy thống kê sản phẩm
  getProductStats: async (shopId) => {
    try {
      const response = await productApi.getProductStats(shopId);
      return response.data;
    } catch (error) {
      console.error("Error fetching product statistics:", error);
      throw error;
    }
  },

  // Xử lý vi phạm sản phẩm
  handleViolation: async (productId, responseData) => {
    try {
      const response = await productApi.handleViolation(
        productId,
        responseData
      );
      return response.data;
    } catch (error) {
      console.error("Error handling violation:", error);
      throw error;
    }
  },

  // Lấy danh sách danh mục sản phẩm
  getCategories: async () => {
    try {
      console.log("Đang gọi API lấy danh mục sản phẩm...");
      const response = await productApi.getCategories();
      console.log("Kết quả API danh mục:", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      throw error;
    }
  },
};

export default productService;
