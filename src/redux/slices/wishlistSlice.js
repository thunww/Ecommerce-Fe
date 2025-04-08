import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import wishlistApi from "../../api/wishlistApi";

// Async thunks
export const fetchWishlist = createAsyncThunk(
    "wishlist/fetchWishlist",
    async (_, { rejectWithValue }) => {
        try {
            const response = await wishlistApi.getWishlist();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Lỗi khi tải danh sách yêu thích");
        }
    }
);

export const addToWishlist = createAsyncThunk(
    "wishlist/addToWishlist",
    async (product, { rejectWithValue }) => {
        try {
            const response = await wishlistApi.addToWishlist(product.product_id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Lỗi khi thêm vào danh sách yêu thích");
        }
    }
);

export const removeFromWishlist = createAsyncThunk(
    "wishlist/removeFromWishlist",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await wishlistApi.removeFromWishlist(productId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Lỗi khi xóa khỏi danh sách yêu thích");
        }
    }
);

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearWishlist: (state) => {
            state.items = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch wishlist
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add to wishlist
            .addCase(addToWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Remove from wishlist
            .addCase(removeFromWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(item => item.product_id !== action.payload.product_id);
            })
            .addCase(removeFromWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer; 