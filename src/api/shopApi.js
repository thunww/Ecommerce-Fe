import axiosClient from "./axiosClient";

const shopApi = {
  getAllShops: () => axiosClient.get("/admin/shops"),
  //   getShopById: (shopId) => axiosClient.get(`/shops/${shopId}`),
  //   createShop: (shopData) => axiosClient.post("/shops", shopData),
  //   updateShop: (shopId, shopData) =>
  //     axiosClient.put(`/shops/${shopId}`, shopData),
  //   deleteShop: (shopId) => axiosClient.delete(`/shops/${shopId}`),
  assignStatusToShop: (shopId, status) =>
    axiosClient.post(`admin/shops/assign-status`, { shopId, status }),
};

export default shopApi;
