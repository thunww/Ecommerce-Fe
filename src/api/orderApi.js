import axiosClient from './axiosClient';

const orderApi = {
    createOrder: (orderData) => {
        const url = '/orders';
        return axiosClient.post(url, orderData);
    },

    getOrder: (orderId) => {
        const url = `/orders/${orderId}`;
        return axiosClient.get(url);
    },

    getOrders: () => {
        const url = '/orders';
        return axiosClient.get(url);
    }
};

export default orderApi; 