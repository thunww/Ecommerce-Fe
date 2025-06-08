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
  searchProduct: ({
    keyword = "",
    categoryId,
    minPrice,
    maxPrice,
    sort,
    minRating,
  } = {}) =>
    axiosClient.get("/products/search", {
      params: {
        q: keyword,
        category_id: categoryId,
        min_price: minPrice,
        max_price: maxPrice,
        sort,
        min_rating: minRating,
      },
    }),
  searchSuggest: (keyword, limit = 5) =>
    axiosClient.get("/products/suggest", {
      params: {
        q: keyword,
        limit,
      },
    }),
};

export default productApi;
