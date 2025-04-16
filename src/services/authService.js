import authApi from "../api/authApi";

const authService = {
  login: async (userData) => {
    try {
      const response = await authApi.login(userData);
      const { token, user, message } = response.data; // Lấy luôn message từ API
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
      throw new Error(error.response?.data.message || "Registration failed");
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
      return await authApi.getProfile();
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  },
};

export default authService;
