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

// **Khởi tạo state**
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  roles: JSON.parse(localStorage.getItem("roles")) || [],
  token: localStorage.getItem("accessToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  isLoading: false,
  error: null,
};

// **Tạo slice**
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
      // Xử lý đăng ký
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.roles = action.payload.user.roles;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("accessToken", action.payload.token);
        localStorage.setItem(
          "roles",
          JSON.stringify(action.payload.user.roles)
        );
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
        console.log("Login fulfilled! Payload:", action.payload);
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.roles = action.payload.user.roles;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("accessToken", action.payload.token);
        localStorage.setItem(
          "roles",
          JSON.stringify(action.payload.user.roles)
        );
        console.log("Updated Redux State:", state.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Xử lý lấy thông tin người dùng (getProfile)
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
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

      // Xử lý đăng xuất
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.roles = [];
        state.isAuthenticated = false;
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("roles");
      });
  },
});

// Export actions và reducer
export const { checkAuthStatus } = authSlice.actions;
export default authSlice.reducer;
