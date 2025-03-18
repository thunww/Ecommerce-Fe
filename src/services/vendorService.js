import axiosClient from "../api/axiosClient";

export const getAllOrders = async () => {
  try {
    const response = await axiosClient.get("/vendors/orders");
    console.log("Danh sách đơn hàng:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    return [];
  }
};

export const getRevenue = async () => {
  try {
    const response = await axiosClient.get("/vendors/revenue");
    console.log("Doanh thu:", response.data);
    return response.data.revenue || 0;
  } catch (error) {
    console.error("Lỗi khi lấy doanh thu:", error);
    return 0;
  }
};
