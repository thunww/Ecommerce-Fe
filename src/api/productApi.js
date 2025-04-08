import axiosClient from "./axiosClient";

const productApi = {
  getAllProducts: () => axiosClient.get("/products"),

  updateProductStatus: (productId, status) =>
    axiosClient.put("/products/assign-product", {
      product_id: productId,
      status,
    }),

  deleteProduct: (productId) => axiosClient.delete(`/products/${productId}`),

  getProductById: (productId) => axiosClient.get(`/products/${productId}`),

  getProductRelated: (categoryId) =>
    axiosClient.get(`/products/related/${categoryId}`),
};

export default productApi;
