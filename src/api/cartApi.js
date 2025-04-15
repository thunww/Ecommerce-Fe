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
    // ===== CART OPERATIONS =====
    getCart: () => {
        console.log("CartAPI: Fetching cart");
        const token = localStorage.getItem("accessToken");

        // Ghi log thông tin token để debug (chỉ hiển thị vài ký tự đầu và cuối)
        if (token) {
            const tokenStart = token.substring(0, 10);
            const tokenEnd = token.substring(token.length - 5);
            console.log(`CartAPI: Using token (masked): ${tokenStart}...${tokenEnd}`);
        }

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

        // Thêm options để debug network request
        const requestOptions = {
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        };

        return axiosClient.get("/cart", requestOptions)
            .then(response => {
                console.log("CartAPI: getCart response:", response);
                return response;
            })
            .catch(error => {
                console.error(`CartAPI: Error in getCart:`, error);

                // Kiểm tra lỗi liên quan đến xác thực
                if (error.message?.includes('Unauthorized') ||
                    error.message?.includes('token') ||
                    error.status === 400 ||
                    error.status === 401) {
                    console.warn("CartAPI: Lỗi xác thực, xóa token và đăng nhập lại");
                    // Đề xuất refresh trang hoặc đăng nhập lại
                }

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

    updateCartItem: async (cartItemId, quantity) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                throw new Error('Chưa đăng nhập');
            }

            console.log('API: Cập nhật số lượng sản phẩm', { cartItemId, quantity });
            const response = await axiosClient.put(`/cart/items/${cartItemId}`, {
                quantity: quantity
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('API: Kết quả cập nhật', response.data);
            return response;
        } catch (error) {
            console.error('Lỗi khi cập nhật số lượng:', error);
            throw error;
        }
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

    // ===== COUPON OPERATIONS =====
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

    removeCoupon: () => {
        console.log("CartAPI: Removing coupon");

        if (!hasValidToken()) {
            return Promise.reject({ message: "Vui lòng đăng nhập để xóa mã giảm giá" });
        }

        return axiosClient.delete("/cart/coupons")
            .then(response => {
                console.log("CartAPI: removeCoupon response:", response);
                return response;
            })
            .catch(error => handleApiError(error, "removeCoupon"));
    },

    validateCoupon: (code) => {
        logApiCall("validateCoupon", code);

        if (!hasValidToken()) {
            return Promise.reject({ message: "Vui lòng đăng nhập để kiểm tra mã giảm giá" });
        }

        return axiosClient.get(`/coupons/validate?code=${code}`)
            .then(response => {
                console.log("CartAPI: validateCoupon response:", response);
                return response;
            })
            .catch(error => handleApiError(error, "validateCoupon"));
    },

    // ===== CHECKOUT OPERATIONS =====
    getCartSummary: () => {
        console.log("CartAPI: Fetching cart summary");

        if (!hasValidToken()) {
            return Promise.reject({ message: "Vui lòng đăng nhập để xem tổng giỏ hàng" });
        }

        return axiosClient.get("/cart/summary")
            .then(response => {
                console.log("CartAPI: getCartSummary response:", response);
                return response;
            })
            .catch(error => handleApiError(error, "getCartSummary"));
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

    // ===== ADDRESS OPERATIONS =====
    getUserAddresses: () => {
        console.log("CartAPI: Fetching user addresses");

        if (!hasValidToken()) {
            return Promise.reject({ message: "Vui lòng đăng nhập để xem địa chỉ" });
        }

        return axiosClient.get("/addresses")
            .then(response => {
                console.log("CartAPI: getUserAddresses response:", response);
                return response;
            })
            .catch(error => handleApiError(error, "getUserAddresses"));
    },

    addAddress: (addressData) => {
        logApiCall("addAddress", addressData);

        if (!hasValidToken()) {
            return Promise.reject({ message: "Vui lòng đăng nhập để thêm địa chỉ" });
        }

        return axiosClient.post("/addresses", addressData)
            .then(response => {
                console.log("CartAPI: addAddress response:", response);
                return response;
            })
            .catch(error => handleApiError(error, "addAddress"));
    },

    updateAddress: (addressId, addressData) => {
        logApiCall("updateAddress", addressId, addressData);

        if (!hasValidToken()) {
            return Promise.reject({ message: "Vui lòng đăng nhập để cập nhật địa chỉ" });
        }

        return axiosClient.put(`/addresses/${addressId}`, addressData)
            .then(response => {
                console.log("CartAPI: updateAddress response:", response);
                return response;
            })
            .catch(error => handleApiError(error, "updateAddress"));
    },

    deleteAddress: (addressId) => {
        logApiCall("deleteAddress", addressId);

        if (!hasValidToken()) {
            return Promise.reject({ message: "Vui lòng đăng nhập để xóa địa chỉ" });
        }

        return axiosClient.delete(`/addresses/${addressId}`)
            .then(response => {
                console.log("CartAPI: deleteAddress response:", response);
                return response;
            })
            .catch(error => handleApiError(error, "deleteAddress"));
    },

    setDefaultAddress: (addressId) => {
        logApiCall("setDefaultAddress", addressId);

        if (!hasValidToken()) {
            return Promise.reject({ message: "Vui lòng đăng nhập để đặt địa chỉ mặc định" });
        }

        return axiosClient.put(`/addresses/${addressId}/default`)
            .then(response => {
                console.log("CartAPI: setDefaultAddress response:", response);
                return response;
            })
            .catch(error => handleApiError(error, "setDefaultAddress"));
    },

    // ===== ORDER OPERATIONS =====
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

    // ===== PAYMENT OPERATIONS =====
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

    // ===== SHIPPING OPERATIONS =====
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