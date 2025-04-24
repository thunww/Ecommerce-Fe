import adminApi from "../api/adminApi";

const adminService = {
  getAllUsers: async () => {
    try {
      const response = await adminApi.getAllUsers();
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getUserById: async (userId) => {
    try {
      const response = await adminApi.getUserById(userId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateUserById: async (userId, userData) => {
    try {
      const response = await adminApi.updateUser(userId, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  banUser: async (userId) => {
    try {
      const response = await adminApi.banUser(userId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  unbanUser: async (userId) => {
    try {
      const response = await adminApi.unbanUser(userId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  assignRoleToUser: async (userId, roleId) => {
    try {
      const response = await adminApi.assignRoleToUser(userId, roleId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  uploadAvatar: async (formData) => {
    try {
      const response = await adminApi.uploadAvatar(formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};


export default adminService;
