import axiosClient from "./axiosClient";

const categoryApi = {
  // Lấy tất cả danh mục
  getAllCategories: () => axiosClient.get("/categories"),

  // Lấy danh mục theo ID
  getCategoryById: (categoryId) => axiosClient.get(`/categories/${categoryId}`),

  // Tạo mới danh mục
  createCategory: (categoryData) =>
    axiosClient.post("/categories", categoryData),

  // Cập nhật danh mục
  updateCategory: (categoryId, categoryData) =>
    axiosClient.put(`/categories/${categoryId}`, categoryData),

  // Xóa danh mục
  deleteCategory: (categoryId) =>
    axiosClient.delete(`/categories/${categoryId}`),

  // Gán trạng thái cho danh mục
  assignStatusToCategory: (categoryId, status) =>
    axiosClient.post(`/categories/assign-status`, { categoryId, status }),
};

export default categoryApi;
