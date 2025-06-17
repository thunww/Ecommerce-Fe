import axios from "axios";

// Lấy cổng backend từ biến môi trường hoặc mặc định là 8080 cho local
const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT || "8080";
const API_URL =
  import.meta.env.VITE_API_URL || `http://localhost:${BACKEND_PORT}/api/v1`;

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Cho phép gửi cookie trong request
  timeout: 10000, // 10 seconds
});

// Không cần interceptor nữa vì cookie sẽ tự động được gửi
axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// // Response interceptor
// axiosClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     console.error("Response error:", error.response?.data || error);

//     // Xử lý lỗi 401 Unauthorized
//     if (error.response && error.response.status === 401) {
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       // Tùy chỉnh: có thể chuyển hướng đến trang đăng nhập
//     }

//     // Trả về thông báo lỗi từ backend
//     return Promise.reject(
//       error.response?.data?.message || error.message || "Lỗi kết nối đến server"
//     );
//   }
// );

export default axiosClient;
