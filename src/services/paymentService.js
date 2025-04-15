import cartApi from "../api/cartApi";
import { message } from "antd";

const paymentService = {
    // Lấy danh sách phương thức thanh toán
    getPaymentMethods: async () => {
        try {
            const response = await cartApi.getPaymentMethods();
            return response.data;
        } catch (error) {
            message.error("Lỗi khi lấy phương thức thanh toán");
            throw error;
        }
    },

    // Tạo thanh toán
    createPayment: async (orderId, method) => {
        try {
            const response = await cartApi.createPayment(orderId, method);
            return response.data;
        } catch (error) {
            message.error("Lỗi khi tạo thanh toán");
            throw error;
        }
    },

    // Xác thực thanh toán
    verifyPayment: async (orderId, paymentId) => {
        try {
            const response = await cartApi.verifyPayment(orderId, paymentId);
            return response.data;
        } catch (error) {
            message.error("Lỗi khi xác thực thanh toán");
            throw error;
        }
    },

    // Lấy thông tin vận chuyển
    getShippingMethods: async () => {
        try {
            const response = await cartApi.getShippingMethods();
            return response.data;
        } catch (error) {
            message.error("Lỗi khi lấy phương thức vận chuyển");
            throw error;
        }
    },

    // Ước tính thời gian giao hàng
    estimateDeliveryTime: async (address, method) => {
        try {
            const response = await cartApi.estimateDeliveryTime(address, method);
            return response.data;
        } catch (error) {
            message.error("Lỗi khi ước tính thời gian giao hàng");
            throw error;
        }
    }
};

export default paymentService; 