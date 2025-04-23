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

    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    checkCartItem: async (product_id, variant_id) => {
        try {
            const response = await axiosClient.get('/cart');
            const cartItems = response.data.items || [];
            return cartItems.find(item =>
                item.product_id === product_id &&
                item.variant_id === variant_id
            );
        } catch (error) {
            console.error('Error checking cart item:', error);
            return null;
        }
    },

    // Lấy thông tin variant
    getVariantInfo: async (variant_id) => {
        try {
            const response = await axiosClient.get(`/products/variants/${variant_id}`);
            return response.data;
        } catch (error) {
            console.error('Error getting variant info:', error);
            return null;
        }
    },

    // Thêm sản phẩm vào giỏ hàng
    addToCart: async (product_id, quantity = 1, variant_id = null) => {
        try {
            if (!product_id) {
                throw new Error('Thiếu thông tin sản phẩm');
            }

            const data = {
                product_id,
                quantity,
                variant_id
            };

            console.log('CartAPI: Adding to cart with data:', data);
            const response = await axiosClient.post('/cart/items', data);
            console.log('CartAPI: Add to cart response:', response.data);
            return response.data;
        } catch (error) {
            handleApiError(error, 'addToCart');
            throw error;
        }
    },

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    updateCartItem: async (cart_item_id, quantity) => {
        try {
            if (!cart_item_id || quantity < 1) {
                throw new Error('Thông tin không hợp lệ');
            }

            const response = await axiosClient.put(`/cart/items/${cart_item_id}`, {
                quantity
            });

            if (!response.data) {
                throw new Error('Không nhận được phản hồi từ server');
            }

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            handleApiError(error, 'updateCartItem');
            throw error;
        }
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