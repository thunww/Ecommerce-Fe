import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService";

// Action login
export const login = createAsyncThunk("auth/login", async (userData, thunkAPI) => {
    try {
        const { token, user } = await authService.login(userData); // Đổi accessToken → token
        return { token, user };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// Action logout
export const logout = createAsyncThunk("auth/logout", async () => {
    await authService.logout();
    return null; // Reset state
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: JSON.parse(localStorage.getItem("user")) || null, // Lấy user từ localStorage
        isLoading: false,
        error: null,
    },

    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                localStorage.setItem("accessToken", action.payload.token);
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null; // Xóa user khỏi Redux
            });
    },
});

export default authSlice.reducer;
