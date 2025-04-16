import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Response error:", error.response || error);

    // Xử lý lỗi 401 Unauthorized
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // Tùy chỉnh: có thể chuyển hướng đến trang đăng nhập
    }

    return Promise.reject(
      error.response?.data || error.message || "Lỗi kết nối đến server"
    );
  }
);

export default axiosClient;
