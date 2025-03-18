import axiosClient from "../axiosClient";

const productApi = {
  getAllOrders: () => axiosClient.get(`/orders`),
};

export default productApi;
