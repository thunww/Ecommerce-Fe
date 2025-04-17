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

// Action: Đăng xuất (Logout)
export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
  return null;
});

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
  token: localStorage.getItem("accessToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  isLoading: false,
  message: null, // Thêm để lưu message (thành công)
  error: null, // Lưu message lỗi
};

// Tạo slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    checkAuthStatus: (state) => {
      const token = localStorage.getItem("accessToken");
      state.isAuthenticated = !!token;
      state.token = token;
    },
  },
  extraReducers: (builder) => {
    builder
      // Đăng ký
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null; // Reset message
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.roles = action.payload.user?.roles || [];
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.message = action.payload.message; // Lưu message
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("accessToken", action.payload.token);
        localStorage.setItem(
          "roles",
          JSON.stringify(action.payload.user?.roles || [])
        );
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Lưu message lỗi
      })

      // Đăng nhập
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null; // Reset message
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.roles = action.payload.user.roles;
        state.isAuthenticated = true;
        state.message = action.payload.message; // Lưu message
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("accessToken", action.payload.token);
        localStorage.setItem(
          "roles",
          JSON.stringify(action.payload.user.roles)
        );
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Lưu message lỗi
      })

      // Lấy profile
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null; // Reset message
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
        state.token = null;
        state.roles = [];
        state.isAuthenticated = false;
        state.message = null; // Reset message
        state.error = null; // Reset error
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("roles");
      });
  },
});

export const { checkAuthStatus } = authSlice.actions;
export default authSlice.reducer;
