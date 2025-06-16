import authApi from "../api/authApi";
import { register } from "../redux/authSlice";

const authService = {
  login: async (userData) => {
    try {
      const response = await authApi.login(userData);
      const { user, message } = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("roles", JSON.stringify(user.roles));
      return { user, message };
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },
  register: async (userData) => {
    try {
      const response = await authApi.register(userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },
  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("roles");
    }
  },
  getProfile: async () => {
    try {
      const response = await authApi.getProfile();
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  },
  getUserById: async (userId) => {
    try {
      if (!userId) {
        throw new Error("userId is required");
      }
      const response = await authApi.getUserById(userId);
      return response.data;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch user information"
      );
    }
  },
};

export default authService;
