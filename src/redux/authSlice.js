import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService";

// Action đăng ký (register)
export const register = createAsyncThunk("auth/register", async (userData, thunkAPI) => {
    try {
        const response = await authService.register(userData);
        return response;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

// Action đăng nhập (login)
export const login = createAsyncThunk("auth/login", async (userData, thunkAPI) => {
    try {
        const response = await authService.login(userData); // response bây giờ có { user, token, message }
        return response; // Trả về đầy đủ thông tin
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message); // Trả về lỗi rõ ràng
    }
});


// Action đăng xuất (logout)
export const logout = createAsyncThunk("auth/logout", async () => {
    await authService.logout();
    return null; // Reset state
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: JSON.parse(localStorage.getItem("user")) || null, // Lấy user từ localStorage
        roles: JSON.parse(localStorage.getItem("roles")) || [],
        token: localStorage.getItem("accessToken") || null,
        isAuthenticated: !!localStorage.getItem("accessToken"),
        isLoading: false,
        error: null,
    },
    reducers: {
        // Hàm kiểm tra trạng thái đăng nhập
        checkAuthStatus: (state) => {
            const token = localStorage.getItem("accessToken");
            state.isAuthenticated = !!token;
            state.token = token;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload; // Lưu user vào Redux
                state.roles = action.payload.user.roles;
                state.isAuthenticated = true;
                localStorage.setItem("user", JSON.stringify(action.payload));
                localStorage.setItem("accessToken", action.payload.token);
                localStorage.setItem("roles", JSON.stringify(action.payload.user.roles));
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                localStorage.setItem("user", JSON.stringify(action.payload.user));
                localStorage.setItem("accessToken", action.payload.token);
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null; // Xóa user khỏi Redux
                state.token = null;
                state.isAuthenticated = false;
                state.roles = [];
                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("roles");
            });
    },
});

export const { checkAuthStatus } = authSlice.actions;
export default authSlice.reducer;