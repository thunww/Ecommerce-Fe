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
import { message } from "antd";

// Dữ liệu mẫu để đảm bảo luôn có dữ liệu hiển thị
const mockCartData = {
    items: [
        {
            id: 1,
            cart_item_id: 1,
            name: "Sản phẩm mẫu 1",
            product_name: "Sản phẩm mẫu 1",
            product_image: "https://placehold.co/600x400?text=SP1",
            variant_name: "Xanh / M",
            price: 150000,
            original_price: 200000,
            quantity: 2,
            stock: 10
        },
        {
            id: 2,
            cart_item_id: 2,
            name: "Sản phẩm mẫu 2",
            product_name: "Sản phẩm mẫu 2",
            product_image: "https://placehold.co/600x400?text=SP2",
            variant_name: "Đỏ / L",
            price: 250000,
            quantity: 1,
            stock: 5
        }
    ],
    shippingFee: 30000,
    discount: 50000
};

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