import axiosClient from "./axiosClient";


// Helper để log API calls
const logApiCall = (name, ...args) => {
    console.log(`CartAPI: Calling ${name} with args:`, ...args);
    return args[0]; // Trả về tham số đầu tiên để dùng trong promise chain
};

// Helper để xử lý lỗi
const handleApiError = (error, apiName) => {
    console.error(`CartAPI: Error in ${apiName}:`, error);
    throw error; // Re-throw để cartService xử lý
};

// Helper để kiểm tra token
const hasValidToken = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        console.warn("CartAPI: No access token found");
        return false;
    }
    return true;
};

const cartApi = {
    // Lấy giỏ hàng
    getCart: () => {
        const url = "/cart";
        return axiosClient.get(url);
    },

    // Thêm sản phẩm vào giỏ hàng
    addToCart: (product_id, quantity = 1, variant_id = null) => {
        const url = "/cart/items";
        return axiosClient.post(url, { product_id, quantity, variant_id });
    },

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    updateCartItem: (cart_item_id, quantity) => {
        const url = `/cart/items/${cart_item_id}`;
        return axiosClient.put(url, { quantity });
    },

    // Xóa sản phẩm khỏi giỏ hàng
    removeFromCart: (cart_item_id) => {
        const url = `/cart/items/${cart_item_id}`;
        return axiosClient.delete(url);
    },

    // Xóa toàn bộ giỏ hàng
    clearCart: () => {
        const url = "/api/v1/cart";
        return axiosClient.delete(url);
    },

    // Áp dụng mã giảm giá
    applyCoupon: (code) => {
        const url = "/api/v1/cart/coupon";
        return axiosClient.post(url, { code });
    },

    // Tính phí vận chuyển
    calculateShipping: (address) => {
        const url = "/api/v1/cart/shipping";
        return axiosClient.post(url, { address });
    },

    // Thanh toán
    checkout: (data) => {
        const url = "/api/v1/cart/checkout";
        return axiosClient.post(url, data);
    },

    // Lấy trạng thái đơn hàng
    getOrderStatus: (orderId) => {
        const url = `/api/v1/cart/orders/${orderId}/status`;
        return axiosClient.get(url);
    },

    // Lấy lịch sử đơn hàng
    getOrderHistory: () => {
        const url = "/api/v1/cart/orders";
        return axiosClient.get(url);
    },

    // Hủy đơn hàng
    cancelOrder: (orderId) => {
        const url = `/api/v1/cart/orders/${orderId}/cancel`;
        return axiosClient.post(url);
    },

    // Theo dõi đơn hàng
    trackOrder: (orderId) => {
        const url = `/api/v1/cart/orders/${orderId}/track`;
        return axiosClient.get(url);
    },

    // Lấy danh sách phương thức thanh toán
    getPaymentMethods: () => {
        const url = "/api/v1/cart/payment-methods";
        return axiosClient.get(url);
    },

    // Tạo thanh toán
    createPayment: (orderId, method) => {
        const url = "/api/v1/cart/payment";
        return axiosClient.post(url, { orderId, method });
    },

    // Xác minh thanh toán
    verifyPayment: (paymentId) => {
        const url = `/api/v1/cart/payment/${paymentId}/verify`;
        return axiosClient.post(url);
    },

    // Lấy danh sách phương thức vận chuyển
    getShippingMethods: () => {
        const url = "/api/v1/cart/shipping-methods";
        return axiosClient.get(url);
    },

    // Ước tính thời gian giao hàng
    estimateDeliveryTime: (address) => {
        const url = "/api/v1/cart/estimate-delivery";
        return axiosClient.post(url, { address });
    }
};

export const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    calculateShipping,
    checkout,
    getOrderStatus,
    getOrderHistory,
    cancelOrder,
    trackOrder,
    getPaymentMethods,
    createPayment,
    verifyPayment,
    getShippingMethods,
    estimateDeliveryTime
} = cartApi; 