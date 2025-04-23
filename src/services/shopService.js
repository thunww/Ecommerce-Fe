import shopApi from "../api/shopApi";

const shopService = {
  getAllShops: async () => {
    try {
      const response = await shopApi.getAllShops();
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getShopById: async (shopId) => {
    try {
      const response = await shopApi.getShopById(shopId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  assignStatusToShop: async (shopId, status) => {
    try {
      const response = await shopApi.assignStatusToShop(shopId, status);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default shopService;
