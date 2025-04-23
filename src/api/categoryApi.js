import axiosClient from "./axiosClient";

const categoryApi = {
  getAllCategories: () => axiosClient.get("/categories"),

  getCategoryById: (categoryId) => axiosClient.get(`/categories/${categoryId}`),


  createCategory: (categoryData) =>
    axiosClient.post("/categories", categoryData),

  updateCategory: (categoryId, categoryData) =>
    axiosClient.put(`/categories/${categoryId}`, categoryData),

  deleteCategory: (categoryId) =>
    axiosClient.delete(`/categories/${categoryId}`),

  assignStatusToCategory: (categoryId, status) =>
    axiosClient.post(`/categories/assign-status`, { categoryId, status }),
};

export default categoryApi;
