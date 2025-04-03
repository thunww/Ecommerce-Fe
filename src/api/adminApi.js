import axiosClient from "./axiosClient";

const adminApi = {
  getAllUsers: () => axiosClient.get("/admin/users"),
  getUserById: (userId) => axiosClient.get(`/users/${userId}`),
  updateUser: (userId, userData) =>
    axiosClient.put(`/users/${userId}`, userData),
  banUser: (userId) => axiosClient.put(`admin/users/ban`, { userId }),
  unbanUser: (userId) => axiosClient.put(`admin/users/unban`, { userId }),
  assignRoleToUser: (userId, roleId) =>
    axiosClient.post(`admin/users/assign-role`, { userId, roleId }),
};

export default adminApi;
