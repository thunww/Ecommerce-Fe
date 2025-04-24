import axiosClient from "./axiosClient";

const shipperApi = {
  getAllShipper: () => axiosClient.get("/shippers/admin/"),
  updateStatus: (shipperId, status) =>
    axiosClient.put(`/shippers/${shipperId}/status`, { status }),
};
export default shipperApi;
