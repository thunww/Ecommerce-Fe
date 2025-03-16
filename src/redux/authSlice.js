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
        isLoading: false,
        error: null,
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
                localStorage.setItem("user", JSON.stringify(action.payload));
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
                localStorage.setItem("accessToken", action.payload.token);
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null; // Xóa user khỏi Redux
                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
            });
    },
});

export default authSlice.reducer