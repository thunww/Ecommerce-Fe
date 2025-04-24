import authApi from "../api/authApi";
import { register } from "../redux/authSlice";

const authService = {
  login: async (userData) => {
    try {
      const response = await authApi.login(userData);
      const { token, user, message } = response.data;
      console.log("res", response.data);
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("roles", JSON.stringify(user.roles));
      return { user, token, message };
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
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
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
