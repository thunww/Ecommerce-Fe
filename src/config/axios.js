import axios from "axios";

// Lấy cổng backend từ biến môi trường hoặc mặc định là 8080 cho local
const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT || "8080";
const API_URL =
  import.meta.env.VITE_API_URL || `http://localhost:${BACKEND_PORT}/api/v1`;

// Cấu hình mặc định cho axios
axios.defaults.baseURL = API_URL;

// Xóa interceptor để tự động thêm token vào header vì token sẽ được gửi qua HttpOnly cookie
/*
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
*/

export default axios;
