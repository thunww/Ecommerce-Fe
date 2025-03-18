import axiosClient from "./axiosClient";

const adminApi = {
  getAllUsers: () => axiosClient.get("/admin/users"),
  getUserById: (userId) => axiosClient.get(`/admin/users/${userId}`),
  updateUser: (userId, userData) =>
    axiosClient.put(`/admin/users/${userId}`, userData),
};

export default adminApi;
