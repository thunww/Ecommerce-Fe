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
    getCart: () => {
        console.log("CartAPI: Fetching cart");

        // Kiểm tra token trước khi gọi API
        if (!hasValidToken()) {
            console.warn("CartAPI: Trả về giỏ hàng trống vì chưa đăng nhập");
            return Promise.resolve({
                data: {
                    items: [],
                    total_price: 0,
                    shippingFee: 0,
                    discount: 0,
                    subtotal: 0,
                    total: 0
                }
            });
        }

        return axiosClient.get("/cart")
            .then(response => {
                console.log("CartAPI: getCart response:", response);
                return response;
            })
            .catch(error => {
                console.error(`CartAPI: Error in getCart:`, error);
                // Trả về giỏ hàng trống nếu có lỗi
                return {
                    data: {
                        items: [],
                        total_price: 0,
                        shippingFee: 0,
                        discount: 0,
                        subtotal: 0,
                        total: 0
                    }
                };
            });
    },

    addToCart: (data) => {
        logApiCall("addToCart", data);

        if (!hasValidToken()) {
            return Promise.reject({ message: "Vui lòng đăng nhập để thêm vào giỏ hàng" });
        }

        return axiosClient.post("/cart/items", data)
            .then(response => {
                console.log("CartAPI: addToCart response:", response);
                return response;
            })
            .catch(error => handleApiError(error, "addToCart"));
    },

    updateCartItem: (cartItemId, data) => {
        logApiCall("updateCartItem", cartItemId, data);

        if (!hasValidToken()) {
            return Promise.reject({ message: "Vui lòng đăng nhập để cập nhật giỏ hàng" });
        }

        return axiosClient.put(`/cart/items/${cartItemId}`, data)
            .then(response => {
                console.log("CartAPI: updateCartItem response:", response);
                return response;
            })
            .catch(error => handleApiError(error, "updateCartItem"));
    },

    removeFromCart: (cartItemId) => {
        logApiCall("removeFromCart", cartItemId);

        if (!hasValidToken()) {
            return Promise.reject({ message: "Vui lòng đăng nhập để xóa sản phẩm khỏi giỏ hàng" });
        }

        return axiosClient.delete(`/cart/items/${cartItemId}`)
            .then(response => {
                console.log("CartAPI: removeFromCart response:", response);
                return response;
            })
            .catch(error => handleApiError(error, "removeFromCart"));
    },

    clearCart: () => {
        console.log("CartAPI: Clearing cart");

        if (!hasValidToken()) {
            return Promise.reject({ message: "Vui lòng đăng nhập để xóa giỏ hàng" });
        }

        return axiosClient.delete("/cart")
            .then(response => {
                console.log("CartAPI: clearCart response:", response);
                return response;
            })
            .catch(error => handleApiError(error, "clearCart"));
    },

    applyCoupon: (code) => {
        logApiCall("applyCoupon", code);

        if (!hasValidToken()) {
            return Promise.reject({ message: "Vui lòng đăng nhập để áp dụng mã giảm giá" });
        }

        return axiosClient.post("/cart/coupons", { code })
            .then(response => {
                console.log("CartAPI: applyCoupon response:", response);
                return response;
            })
            .catch(error => handleApiError(error, "applyCoupon"));
    },

    calculateShipping: (address) => {
        logApiCall("calculateShipping", address);

        if (!hasValidToken()) {
            return Promise.reject({ message: "Vui lòng đăng nhập để tính phí vận chuyển" });
        }

        return axiosClient.post("/cart/shipping", { address })
            .then(response => {
                console.log("CartAPI: calculateShipping response:", response);
                return response;
            })
            .catch(error => handleApiError(error, "calculateShipping"));
    },

    checkout: (data) => {
        logApiCall("checkout", data);

        if (!hasValidToken()) {
            return Promise.reject({ message: "Vui lòng đăng nhập để đặt hàng" });
        }

        return axiosClient.post("/orders", data)
            .then(response => {
                console.log("CartAPI: checkout response:", response);
                return response;
            })
            .catch(error => handleApiError(error, "checkout"));
    },

    getOrderStatus: (orderId) => {
        if (!hasValidToken()) {
            return Promise.reject({ message: "Vui lòng đăng nhập để xem trạng thái đơn hàng" });
        }

        return axiosClient.get(`/orders/${orderId}`)
            .then(response => {
                console.log("CartAPI: getOrderStatus response:", response);
                return response;
            })
            .catch(error => handleApiError(error, "getOrderStatus"));
    },

    getOrderHistory: () => {
        if (!hasValidToken()) {
            return Promise.reject({ message: "Vui lòng đăng nhập để xem lịch sử đơn hàng" });
        }

        return axiosClient.get("/orders")
            .then(response => {
                console.log("CartAPI: getOrderHistory response:", response);
                return response;
            })
            .catch(error => handleApiError(error, "getOrderHistory"));
    },

    cancelOrder: (orderId) => {
        if (!hasValidToken()) {
            return Promise.reject({ message: "Vui lòng đăng nhập để hủy đơn hàng" });
        }

        return axiosClient.put(`/orders/${orderId}/cancel`)
            .then(response => {
                console.log("CartAPI: cancelOrder response:", response);
                return response;
            })
            .catch(error => handleApiError(error, "cancelOrder"));
    },

    trackOrder: (orderId) => {
        if (!hasValidToken()) {
            return Promise.reject({ message: "Vui lòng đăng nhập để theo dõi đơn hàng" });
        }

        return axiosClient.get(`/orders/${orderId}/tracking`)
            .then(response => {
                console.log("CartAPI: trackOrder response:", response);
                return response;
            })
            .catch(error => handleApiError(error, "trackOrder"));
    },

    getPaymentMethods: () => {
        return axiosClient.get("/payments/methods")
            .then(response => {
                console.log("CartAPI: getPaymentMethods response:", response);
                return response;
            })
            .catch(error => handleApiError(error, "getPaymentMethods"));
    },

    createPayment: (orderId, method) => {
        if (!hasValidToken()) {
            return Promise.reject({ message: "Vui lòng đăng nhập để tạo thanh toán" });
        }

        return axiosClient.post(`/payments/orders/${orderId}`, { method })
            .then(response => {
                console.log("CartAPI: createPayment response:", response);
                return response;
            })
            .catch(error => handleApiError(error, "createPayment"));
    },

    verifyPayment: (orderId, paymentId) => {
        if (!hasValidToken()) {
            return Promise.reject({ message: "Vui lòng đăng nhập để xác nhận thanh toán" });
        }

        return axiosClient.get(`/payments/orders/${orderId}/verify/${paymentId}`)
            .then(response => {
                console.log("CartAPI: verifyPayment response:", response);
                return response;
            })
            .catch(error => handleApiError(error, "verifyPayment"));
    },

    getShippingMethods: () => {
        return axiosClient.get("/shipping/methods")
            .then(response => {
                console.log("CartAPI: getShippingMethods response:", response);
                return response;
            })
            .catch(error => handleApiError(error, "getShippingMethods"));
    },

    estimateDeliveryTime: (address, method) => {
        return axiosClient.post("/shipping/estimate", { address, method })
            .then(response => {
                console.log("CartAPI: estimateDeliveryTime response:", response);
                return response;
            })
            .catch(error => handleApiError(error, "estimateDeliveryTime"));
    }
};

export default cartApi; 