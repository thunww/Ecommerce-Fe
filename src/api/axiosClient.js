import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm Interceptor nếu cần
axiosClient.interceptors.request.use(
  (config) => {
    // Kiểm tra cả hai trường hợp tên token
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");

    if (token) {
      console.log(
        "Using token from localStorage:",
        token.substring(0, 20) + "..."
      );
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.log("No token found in localStorage");
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Interceptors Response
axiosClient.interceptors.response.use(
  (response) => {
    // Xử lý response thành công
    return response;
  },
  async (error) => {
    // Xử lý lỗi (ví dụ: token hết hạn)
    const originalRequest = error.config;

    if (error.response) {
      console.error(
        "Response error:",
        error.response.status,
        error.response.data
      );

      // Xử lý lỗi 401 (Unauthorized)
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Thử lấy token mới (nếu có refresh token)
          // const refreshToken = localStorage.getItem("refreshToken");
          // const res = await axios.post("/auth/refresh-token", { refreshToken });
          // const newToken = res.data.accessToken;
          // localStorage.setItem("accessToken", newToken);
          // originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          // return axiosClient(originalRequest);

          // Nếu không có refresh token flow, đăng xuất
          console.error("Token expired or invalid - logging out");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          localStorage.removeItem("roles");
          window.location.href = "/login";
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
