import axiosClient from "./axiosClient";

const productApi = {
  getAllProducts: () => axiosClient.get("/products"),

  updateProductStatus: (productId, status) =>
    axiosClient.put("/products/assign-product", {
      product_id: productId,
      status,
    }),

  deleteProduct: (productId) => axiosClient.delete(`/products/${productId}`),
};

export default productApi;
