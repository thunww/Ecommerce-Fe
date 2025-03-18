import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/vendors/orders";

export const getAllOrders = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; 
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    return [];
  }
};
