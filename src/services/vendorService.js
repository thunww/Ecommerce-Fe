import axiosClient from "../api/axiosClient";

export const getAllOrders = async (userId) => {
  try {
    if (!userId) {
      throw new Error("userId is required");
    }

    const response = await axiosClient.get("/vendor/orders");

    if (!response.data) {
      throw new Error("No data received from server");
    }

    console.log("Danh sách đơn hàng:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    if (error.response) {
      // Lỗi từ server
      const errorMessage = error.response.data?.message || "Lỗi từ server";
      console.error("Server error details:", error.response.data);
      throw new Error(errorMessage);
    } else if (error.request) {
      // Lỗi không có response
      console.error("Network error:", error.request);
      throw new Error("Không thể kết nối đến server");
    } else {
      // Lỗi khác
      console.error("Other error:", error);
      throw error;
    }
  }
};

export const getRevenue = async (userId) => {
  try {
    if (!userId) {
      throw new Error("userId is required");
    }

    const response = await axiosClient.get("/vendor/revenue");
    if (!response.data) {
      throw new Error("No data received from server");
    }
    console.log("Doanh thu:", response.data);
    return response.data.revenue || 0;
  } catch (error) {
    console.error("Lỗi khi lấy doanh thu:", error);
    if (error.response) {
      const errorMessage = error.response.data?.message || "Lỗi từ server";
      console.error("Server error details:", error.response.data);
      throw new Error(errorMessage);
    } else if (error.request) {
      console.error("Network error:", error.request);
      throw new Error("Không thể kết nối đến server");
    } else {
      console.error("Other error:", error);
      throw error;
    }
  }
};

