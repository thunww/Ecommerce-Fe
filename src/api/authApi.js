import axiosClient from "./axiosClient";

const authApi = {
  login: (data) => axiosClient.post("/auth/login", data),
  register: (data) => axiosClient.post("/auth/register", data),
  logout: () => axiosClient.post("/api/v1/auth/logout"),
  getProfile: () => axiosClient.get("/auth/profile"),
};

export default authApi;
