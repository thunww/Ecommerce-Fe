import cartApi from "../api/cartApi";
import { message } from "antd";

const orderService = {
    // Đặt hàng
    checkout: async (data) => {
        try {
            const response = await cartApi.checkout(data);
            message.success("Đặt hàng thành công");
            return response.data;
        } catch (error) {
            message.error("Lỗi khi đặt hàng");
            throw error;
        }
    },

    // Lấy trạng thái đơn hàng
    getOrderStatus: async (orderId) => {
        try {
            const response = await cartApi.getOrderStatus(orderId);
            return response.data;
        } catch (error) {
            message.error("Lỗi khi lấy trạng thái đơn hàng");
            throw error;
        }
    },

    // Lấy lịch sử đơn hàng
    getOrderHistory: async () => {
        try {
            const response = await cartApi.getOrderHistory();
            return response.data;
        } catch (error) {
            message.error("Lỗi khi lấy lịch sử đơn hàng");
            throw error;
        }
    },

    // Hủy đơn hàng
    cancelOrder: async (orderId) => {
        try {
            await cartApi.cancelOrder(orderId);
            message.success("Đã hủy đơn hàng");
        } catch (error) {
            message.error("Lỗi khi hủy đơn hàng");
            throw error;
        }
    },

    // Theo dõi đơn hàng
    trackOrder: async (orderId) => {
        try {
            const response = await cartApi.trackOrder(orderId);
            return response.data;
        } catch (error) {
            message.error("Lỗi khi theo dõi đơn hàng");
            throw error;
        }
    }
};

export default orderService; 