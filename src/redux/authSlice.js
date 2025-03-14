import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService";

// Action đăng ký
export const register = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
    try {
        const response = await authService.register(userData);
        return response.data || response; // Đảm bảo trả về đúng dữ liệu
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Đăng ký thất bại!");
    }
});

// Action đăng nhập
export const login = createAsyncThunk("auth/login", async (userData, { rejectWithValue }) => {
    try {
        const response = await authService.login(userData);
        console.log("API Response:", response);

        if (!response || !response.data) {
            throw new Error("Lỗi máy chủ, vui lòng thử lại!");
        }

        const { token, user, message } = response.data;
        
        // Lưu thông tin đăng nhập vào localStorage
        localStorage.setItem("accessToken", token);
        localStorage.setItem("user", JSON.stringify(user));

        return { token, user, message };
    } catch (error) {
        console.error("Login Error:", error.response?.data);
        return rejectWithValue(error.response?.data?.message || "Đăng nhập thất bại!");
    }
});

// Action đăng xuất
export const logout = createAsyncThunk("auth/logout", async (_, { dispatch }) => {
    await authService.logout();

    // Xóa localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    return null;
});

// Khởi tạo state ban đầu
const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("accessToken") || null,
    isLoading: false,
    error: null,
    message: null,
};

// Tạo slice cho auth
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {}, // Hiện tại không cần reducers
    extraReducers: (builder) => {
        builder
            // Xử lý đăng ký
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.message = action.payload.message;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            
            // Xử lý đăng nhập
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.message = action.payload.message;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            
            // Xử lý đăng xuất
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
            });
    },
});

export default authSlice.reducer;
