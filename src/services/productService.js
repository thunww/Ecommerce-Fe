import productApi from "../api/productApi";

const productService = {
  getAllProducts: async () => {
    try {
      const response = await productApi.getAllProducts();
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  updateProductStatus: async (productId, status) => {
    try {
      const response = await productApi.updateProductStatus(productId, status);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteProductById: async (productId) => {
    try {
      const response = await productApi.deleteProduct(productId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getProductById: async (productId) => {
    try {
      const response = await productApi.getProductById(productId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default productService;
