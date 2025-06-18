import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService";

// Action: Đăng ký (Register)
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Action: Đăng nhập (Login)
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await authService.login(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Action: Đăng xuất (Logout)
export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
  return null;
});

// Action: Lấy thông tin user (getProfile)
export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, thunkAPI) => {
    try {
      const response = await authService.getProfile();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: (() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  })(),
  roles: (() => {
    try {
      const raw = localStorage.getItem("roles");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  })(),
  token: null, // Token không còn được quản lý ở frontend
  isAuthenticated: !!localStorage.getItem("user"), // Kiểm tra dựa trên sự tồn tại của user
  isLoading: false,
  message: null,
  error: null,
};

// Tạo slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    checkAuthStatus: (state) => {
      state.isAuthenticated = !!state.user;
    },
    resetMessage: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Đăng ký
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.roles = action.payload.user?.roles || [];
        state.isAuthenticated = false; // Sau đăng ký thường chưa tự động đăng nhập
        state.message = action.payload.message;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem(
          "roles",
          JSON.stringify(action.payload.user?.roles || [])
        );
        // Không lưu accessToken vào localStorage sau khi đăng ký
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Đăng nhập
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.roles = action.payload.user.roles;
        state.isAuthenticated = true;
        state.message = action.payload.message;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem(
          "roles",
          JSON.stringify(action.payload.user.roles)
        );
        // Không lưu accessToken vào localStorage nữa vì nó được đặt trong HttpOnly cookie
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Lấy profile
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.roles = action.payload.roles;
        localStorage.setItem("user", JSON.stringify(action.payload));
        localStorage.setItem("roles", JSON.stringify(action.payload.roles));
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Đăng xuất
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.roles = [];
        state.isAuthenticated = false;
        state.message = null;
        state.error = null;
        localStorage.removeItem("user");
        localStorage.removeItem("roles");
        // Không cần xóa accessToken khỏi localStorage
      });
  },
});

export const { checkAuthStatus, resetMessage } = authSlice.actions;
export default authSlice.reducer;
