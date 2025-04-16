import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderApi from '../../api/orderApi';
import { message } from 'antd';

export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await orderApi.createOrder(orderData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getOrderDetails = createAsyncThunk(
    'order/getOrderDetails',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await orderApi.getOrderDetails(orderId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getUserOrders = createAsyncThunk(
    'order/getUserOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await orderApi.getUserOrders();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    order: null,
    loading: false,
    error: null,
    success: false
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        resetOrderState: (state) => {
            state.order = null;
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
                state.success = true;
                message.success('Đặt hàng thành công!');
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
                message.error(action.payload?.message || 'Đặt hàng thất bại');
            })
            // Get Order Details
            .addCase(getOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(getOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get User Orders
            .addCase(getUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(getUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer; 