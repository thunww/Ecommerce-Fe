import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartService from "../../services/cartService";
import orderService from "../../services/orderService";
import paymentService from "../../services/paymentService";
import {
    getCart,
    addToCart as addToCartApi,
    updateCartItem as updateCartItemApi,
    removeFromCart as removeFromCartApi
} from "../../api/cartApi";
import couponApi from "../../api/couponApi";
import { message } from "antd";

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
            const response = await getCart();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ product_id, quantity, variant_id }, { rejectWithValue }) => {
        try {
            const response = await addToCartApi(product_id, quantity, variant_id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateCartItem = createAsyncThunk(
    "cart/updateCartItem",
    async ({ cart_item_id, quantity }, { rejectWithValue }) => {
        try {
            const response = await updateCartItemApi(cart_item_id, quantity);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (cart_item_id, { rejectWithValue }) => {
        try {
            const response = await removeFromCartApi(cart_item_id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const validateCoupon = createAsyncThunk(
    "cart/validateCoupon",
    async (code, { rejectWithValue }) => {
        try {
            const response = await couponApi.validateCoupon(code);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const applyCoupon = createAsyncThunk(
    "cart/applyCoupon",
    async ({ code, cart_id }, { rejectWithValue }) => {
        try {
            const response = await couponApi.applyCoupon(code, cart_id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const removeCoupon = createAsyncThunk(
    "cart/removeCoupon",
    async (cart_id, { rejectWithValue }) => {
        try {
            const response = await couponApi.removeCoupon(cart_id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
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
    items: [],
    selectedItems: [], // Mảng chứa các cart_item_id được chọn
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
    trackingInfo: null,
    coupon: null,
    couponError: null
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.items = [];
            state.shippingFee = 0;
            state.discount = 0;
        },
        setSelectedAddress: (state, action) => {
            state.selectedAddress = action.payload;
        },
        setPaymentMethod: (state, action) => {
            state.selectedPaymentMethod = action.payload;
        },
        toggleSelectItem: (state, action) => {
            const { cart_item_id } = action.payload;
            const index = state.selectedItems.indexOf(cart_item_id);
            if (index === -1) {
                state.selectedItems.push(cart_item_id);
            } else {
                state.selectedItems.splice(index, 1);
            }
        },
        clearSelectedItems: (state) => {
            state.selectedItems = [];
        },
        clearCoupon: (state) => {
            state.coupon = null;
            state.discount = 0;
            state.couponError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                console.log('Setting cart data:', action.payload);
                state.items = action.payload.items || [];
                state.shippingFee = action.payload.shippingFee || 0;
                state.discount = action.payload.discount || 0;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                message.success("Đã thêm vào giỏ hàng");
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                message.error(action.payload || "Có lỗi xảy ra");
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.items = action.payload.items || [];
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = action.payload.items || [];
            })
            .addCase(validateCoupon.pending, (state) => {
                state.loading = true;
                state.couponError = null;
            })
            .addCase(validateCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.coupon = action.payload;
            })
            .addCase(validateCoupon.rejected, (state, action) => {
                state.loading = false;
                state.couponError = action.payload;
            })
            .addCase(applyCoupon.pending, (state) => {
                state.loading = true;
                state.couponError = null;
            })
            .addCase(applyCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.coupon = action.payload.coupon;
                state.discount = action.payload.discount;
            })
            .addCase(applyCoupon.rejected, (state, action) => {
                state.loading = false;
                state.couponError = action.payload;
            })
            .addCase(removeCoupon.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeCoupon.fulfilled, (state) => {
                state.loading = false;
                state.coupon = null;
                state.discount = 0;
            })
            .addCase(removeCoupon.rejected, (state, action) => {
                state.loading = false;
                state.couponError = action.payload;
            })
            .addCase(calculateShipping.fulfilled, (state, action) => {
                state.shippingFee = action.payload.shippingFee || 0;
            })
            .addCase(checkout.fulfilled, (state, action) => {
                state.orderStatus = action.payload;
            })
            .addCase(checkout.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(getOrderStatus.fulfilled, (state, action) => {
                state.orderStatus = action.payload;
            })
            .addCase(getOrderStatus.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(trackOrder.fulfilled, (state, action) => {
                state.trackingInfo = action.payload;
            })
            .addCase(trackOrder.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(getPaymentMethods.fulfilled, (state, action) => {
                state.paymentMethods = action.payload;
            })
            .addCase(getPaymentMethods.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(createPayment.fulfilled, (state, action) => {
                // Handle payment creation success
            })
            .addCase(createPayment.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export const { clearCart, setSelectedAddress, setPaymentMethod, toggleSelectItem, clearSelectedItems, clearCoupon } = cartSlice.actions;
export default cartSlice.reducer; 