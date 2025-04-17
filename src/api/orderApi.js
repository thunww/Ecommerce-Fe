import axiosClient from './axiosClient';

const orderApi = {
    createOrder: async (orderData) => {
        console.log('Gọi API tạo đơn hàng với dữ liệu:', orderData);
        const url = 'orders/create';
        try {
            const response = await axiosClient.post(url, orderData);
            console.log('API response:', response);
            return response;
        } catch (error) {
            console.error('Lỗi khi gọi API tạo đơn hàng:', error);
            throw error;
        }
    },

    getOrder: (orderId) => {
        const url = `/api/v1/orders/${orderId}`;
        return axiosClient.get(url);
    },

    getUserOrders: () => {
        const url = '/api/v1/orders/user';
        return axiosClient.get(url);
    },

    cancelOrder: (orderId) => {
        const url = `/api/v1/orders/${orderId}/cancel`;
        return axiosClient.put(url);
    }
};

export default orderApi; 