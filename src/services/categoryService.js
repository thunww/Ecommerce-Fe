import categoryApi from "../api/categoryApi";

const categoryService = {
  // Lấy tất cả danh mục
  getAllCategories: async () => {
    try {
      const response = await categoryApi.getAllCategories();
      return response.data; // { success, message, data }
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh mục theo ID
  getCategoryById: async (categoryId) => {
    try {
      const response = await categoryApi.getCategoryById(categoryId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tạo mới danh mục
  createCategory: async (categoryData) => {
    try {
      const response = await categoryApi.createCategory(categoryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật danh mục
  updateCategory: async (categoryId, categoryData) => {
    try {
      const response = await categoryApi.updateCategory(
        categoryId,
        categoryData
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xoá danh mục
  deleteCategory: async (categoryId) => {
    try {
      const response = await categoryApi.deleteCategory(categoryId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Gán trạng thái (nếu cần thiết)
  assignStatusToCategory: async (categoryId, status) => {
    try {
      const response = await categoryApi.assignStatusToCategory(
        categoryId,
        status
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default categoryService;
