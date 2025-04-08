import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartService from "../../services/cartService";
import orderService from "../../services/orderService";
import paymentService from "../../services/paymentService";

// Dữ liệu giả mẫu cho giỏ hàng
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

// Async thunks
export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (_, { rejectWithValue }) => {
        try {
            const response = await cartService.getCart();
            return response || mockCartData; // Trả về dữ liệu mẫu nếu API lỗi
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu giỏ hàng:", error);
            // Trả về dữ liệu mẫu trong trường hợp lỗi để vẫn hiển thị UI
            return rejectWithValue(error.message);
        }
    }
);

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async (data, { rejectWithValue }) => {
        try {
            return await cartService.addToCart(data);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateCartItem = createAsyncThunk(
    "cart/updateCartItem",
    async ({ cartItemId, data }, { rejectWithValue }) => {
        try {
            return await cartService.updateCartItem(cartItemId, data);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (cartItemId, { rejectWithValue }) => {
        try {
            return await cartService.removeFromCart(cartItemId);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const applyCoupon = createAsyncThunk(
    "cart/applyCoupon",
    async (code, { rejectWithValue }) => {
        try {
            return await cartService.applyCoupon(code);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const calculateShipping = createAsyncThunk(
    "cart/calculateShipping",
    async (address, { rejectWithValue }) => {
        try {
            return await cartService.calculateShipping(address);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const checkout = createAsyncThunk(
    "cart/checkout",
    async (data, { rejectWithValue }) => {
        try {
            return await orderService.checkout(data);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getOrderStatus = createAsyncThunk(
    "cart/getOrderStatus",
    async (orderId, { rejectWithValue }) => {
        try {
            return await orderService.getOrderStatus(orderId);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const trackOrder = createAsyncThunk(
    "cart/trackOrder",
    async (orderId, { rejectWithValue }) => {
        try {
            return await orderService.trackOrder(orderId);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getPaymentMethods = createAsyncThunk(
    "cart/getPaymentMethods",
    async (_, { rejectWithValue }) => {
        try {
            return await paymentService.getPaymentMethods();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createPayment = createAsyncThunk(
    "cart/createPayment",
    async ({ orderId, method }, { rejectWithValue }) => {
        try {
            return await paymentService.createPayment(orderId, method);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    cart: mockCartData, // Sử dụng dữ liệu mẫu làm giá trị mặc định
    loading: false,
    error: null,
    shippingFee: 0,
    discount: 0,
    couponCode: "",
    selectedAddress: null,
    paymentMethods: [],
    orderStatus: null,
    orderHistory: [],
    shippingMethods: [],
    estimatedDeliveryTime: null,
    trackingInfo: null
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearCartState: (state) => {
            return initialState;
        },
        setSelectedAddress: (state, action) => {
            state.selectedAddress = action.payload;
        },
        setPaymentMethod: (state, action) => {
            state.selectedPaymentMethod = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                // Giữ lại dữ liệu mẫu trong trường hợp lỗi
                state.cart = mockCartData;
            })

            // Add to Cart
            .addCase(addToCart.fulfilled, (state, action) => {
                state.cart = action.payload;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Update Cart Item
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.cart = action.payload;
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Remove from Cart
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.cart.items = state.cart.items.filter(
                    (item) => item.cart_item_id !== action.payload
                );
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Apply Coupon
            .addCase(applyCoupon.fulfilled, (state, action) => {
                state.discount = action.payload.discount;
                state.couponCode = action.payload.code;
            })
            .addCase(applyCoupon.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Calculate Shipping
            .addCase(calculateShipping.fulfilled, (state, action) => {
                state.shippingFee = action.payload.fee;
                state.estimatedDeliveryTime = action.payload.estimatedTime;
            })
            .addCase(calculateShipping.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Checkout
            .addCase(checkout.fulfilled, (state, action) => {
                state.orderStatus = action.payload;
            })
            .addCase(checkout.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Get Order Status
            .addCase(getOrderStatus.fulfilled, (state, action) => {
                state.orderStatus = action.payload;
            })
            .addCase(getOrderStatus.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Track Order
            .addCase(trackOrder.fulfilled, (state, action) => {
                state.trackingInfo = action.payload;
            })
            .addCase(trackOrder.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Get Payment Methods
            .addCase(getPaymentMethods.fulfilled, (state, action) => {
                state.paymentMethods = action.payload;
            })
            .addCase(getPaymentMethods.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Create Payment
            .addCase(createPayment.fulfilled, (state, action) => {
                // Handle payment creation success
            })
            .addCase(createPayment.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export const { clearCartState, setSelectedAddress, setPaymentMethod } = cartSlice.actions;

export default cartSlice.reducer; 