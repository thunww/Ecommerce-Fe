// FE/src/api/VendorAPI/revenueApi.js
import axiosClient from "../axiosClient";

const revenueApi = {
  getRevenue: () => {
    return axiosClient.get("/vendor/revenue");
  },
  getShopRevenue: () => {
    return axiosClient.get("/vendor/shop-revenue");
  },
};

export default revenueApi;
