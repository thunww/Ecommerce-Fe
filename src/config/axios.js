import axios from "axios";

// Cấu hình mặc định cho axios
axios.defaults.baseURL = "http://localhost:8080";

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
