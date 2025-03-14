import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api/v1/", // URL của Backend
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Giữ session nếu dùng JWT cookies
});

// Interceptors để tự động gắn token vào request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
