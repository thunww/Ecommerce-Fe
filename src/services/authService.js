import authApi from "../api/authApi";

const authService = {
    login: async (userData) => {
        try {
            const response = await authApi.login(userData);
            console.log("API Response:", response); 
            const { token, user } = response.data;
            
            // Lưu token vào localStorage
            localStorage.setItem("accessToken", token);
            localStorage.setItem("user", JSON.stringify(user));

            return { user, token} ;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Login failed");
        }
    },
    register: async (userData) => {
        try {
            const response = await authApi.register(userData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Login failed");
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
    }
    ,

    getProfile: async () => {
        try {
            return await authApi.getProfile();
        } catch (error) {
            throw new Error(error.response?.data?.message || "Failed to fetch profile");
        }
    }
};

export default authService;
