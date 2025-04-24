import shipperApi from "../api/shipperApi";

const shipperService = {
  getAllShippers: async () => {
    try {
      const response = await shipperApi.getAllShipper();
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateShipperStatus: async (shipperId, status) => {
    try {
     
      const response = await shipperApi.updateStatus(shipperId, status);
      return response.data;
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái shipper:", error);
      throw error;
    }
  },
};

export default shipperService;
