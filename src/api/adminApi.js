import axiosClient from "./axiosClient";

const adminApi = {
  getStats: () => axiosClient.get("/admin/stats"),
};

export default adminApi;
