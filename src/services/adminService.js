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
  getUserById: async (userId) => {},
};

export default adminService;
