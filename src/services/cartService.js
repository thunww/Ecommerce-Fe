import {
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
} from "../api/cartApi";




const cartService = {
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
};

export default cartService; 