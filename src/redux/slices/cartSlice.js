import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartService from "../../services/cartService";
import couponApi from "../../api/couponApi";
import { message } from "antd";

const initialState = {
    items: [],
    selectedItems: [],
    loading: false,
    error: null,
    shippingFee: 0,
    discount: 0,
    couponCode: "",
    selectedAddress: null,
    paymentMethods: [],
    orderStatus: null,
    shippingMethods: [],
    estimatedDeliveryTime: null,
    trackingInfo: null,
    coupon: null,
    couponError: null
};

// Thunks
export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
    try {
        const response = await cartService.getCart();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const addToCart = createAsyncThunk("cart/addToCart", async ({ product_id, quantity, variant_id }, { rejectWithValue }) => {
    try {
        return await cartService.addToCart(product_id, quantity, variant_id);
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const updateCartItem = createAsyncThunk("cart/updateCartItem", async ({ cart_item_id, quantity }, { rejectWithValue }) => {
    try {
        const response = await cartService.updateCartItem(cart_item_id, quantity);
        return response;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const removeFromCart = createAsyncThunk("cart/removeFromCart", async (cart_item_id, { rejectWithValue }) => {
    try {
        const response = await cartService.removeFromCart(cart_item_id);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const validateCoupon = createAsyncThunk("cart/validateCoupon", async (code, { rejectWithValue }) => {
    try {
        const response = await couponApi.validateCoupon(code);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const applyCoupon = createAsyncThunk("cart/applyCoupon", async ({ code }, { dispatch, rejectWithValue }) => {
    try {
        const response = await couponApi.applyCoupon(code);
        await dispatch(fetchCart());
        return response.data; // <-- bạn đang trả về { status, message, data }
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});


export const removeCoupon = createAsyncThunk("cart/removeCoupon", async (_, { dispatch, rejectWithValue }) => {
    try {
        const response = await couponApi.removeCoupon(); // ✅ đúng
        await dispatch(fetchCart());
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});



const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearCart: (state) => {
            state.items = [];
            state.shippingFee = 0;
            state.discount = 0;
        },
        toggleSelectItem: (state, action) => {
            const { cart_item_id } = action.payload;
            const index = state.selectedItems.indexOf(cart_item_id);
            if (index === -1) state.selectedItems.push(cart_item_id);
            else state.selectedItems.splice(index, 1);
        },
        clearSelectedItems: (state) => {
            state.selectedItems = [];
        },
        clearCoupon: (state) => {
            state.coupon = null;
            state.discount = 0;
            state.couponError = null;
        },
        setSelectedItems: (state, action) => {
            state.selectedItems = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                let items = action.payload.items || [];
                const selectedId = localStorage.getItem("selectedCartItemId");

                if (selectedId) {
                    const index = items.findIndex(item => item.cart_item_id === selectedId);
                    if (index !== -1) {
                        const selectedItem = items[index];
                        items.splice(index, 1); // xóa khỏi mảng
                        items.unshift(selectedItem); // đưa lên đầu
                    }
                }

                state.items = items;
                state.shippingFee = action.payload.shippingFee || 0;
                state.discount = action.payload.discount || 0;
                state.coupon = action.payload.coupon || null;
                state.loading = false;
            })


            .addCase(addToCart.fulfilled, (state, action) => {
                const cartData = action.payload;
                let items = cartData.items || [];

                if (items.length > 0) {
                    const lastAddedItem = items[items.length - 1];
                    if (lastAddedItem) {
                        const addedShopId = lastAddedItem.product.shop.shop_id;

                        items = [
                            lastAddedItem,
                            ...items.filter(item =>
                                item.product.shop.shop_id === addedShopId &&
                                item.cart_item_id !== lastAddedItem.cart_item_id
                            ),
                            ...items.filter(item => item.product.shop.shop_id !== addedShopId)
                        ];
                    }
                }

                state.items = items;
                state.shippingFee = cartData.shippingFee || 0;
                state.discount = cartData.discount || 0;
                state.coupon = cartData.coupon || null;

                if (items.length > 0) {
                    localStorage.setItem("selectedCartItemId", items[0].cart_item_id);
                }
            })


            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
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
            .addCase(applyCoupon.fulfilled, (state, action) => {
                const coupon = action.payload?.data?.coupon;

                if (coupon && typeof coupon.discount_amount !== 'undefined') {
                    state.coupon = {
                        code: coupon.code,
                        discount_type: 'percentage',
                        discount_value: parseFloat(coupon.discount_percent),
                        max_discount: null,
                        discount_amount: Number(coupon.discount_amount) || 0 // 👈 thêm dòng này
                    };

                    state.discount = Number(coupon.discount_amount) || 0;
                } else {
                    console.warn('applyCoupon payload không hợp lệ:', action.payload);
                    state.coupon = null;
                    state.discount = 0;
                }
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                const updatedCart = action.payload.data;  // toàn bộ cart

                // Cập nhật toàn bộ state cart
                state.items = updatedCart.items;
                state.total_price = updatedCart.total_price;
                state.shippingFee = updatedCart.shippingFee;
                state.discount = updatedCart.discount;
                state.subtotal = updatedCart.subtotal;
                // cập nhật thêm các trường khác nếu cần
            })









            .addCase(applyCoupon.rejected, (state, action) => {
                state.couponError = action.payload;
            })
            .addCase(removeCoupon.fulfilled, (state) => {
                state.coupon = null;
                state.discount = 0;
            });
    }
});

export const { clearCart, toggleSelectItem, clearSelectedItems, clearCoupon, setSelectedItems } = cartSlice.actions;
export default cartSlice.reducer;
