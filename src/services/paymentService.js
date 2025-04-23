import {
    getPaymentMethods,
    createPayment,
    verifyPayment
} from "../api/cartApi";
import { message } from "antd";

const paymentService = {
    getPaymentMethods,
    createPayment,
    verifyPayment,

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