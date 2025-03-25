import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService";

// Action đăng ký (register)
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Action đăng nhập (login)
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await authService.login(userData); // response bây giờ có { user, token, message }
      return response; // Trả về đầy đủ thông tin
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message); // Trả về lỗi rõ ràng
    }
  }
);

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
    isLoading: false,
    error: null,
  },

  // Thêm reducers để có thể cập nhật trạng thái trực tiếp
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      // Cập nhật localStorage để đảm bảo đồng bộ
      localStorage.setItem("user", JSON.stringify(action.payload));

      // Cập nhật roles nếu có
      if (action.payload && action.payload.roles) {
        state.roles = action.payload.roles;
        localStorage.setItem("roles", JSON.stringify(action.payload.roles));
      }
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
        localStorage.setItem("user", JSON.stringify(action.payload));
        localStorage.setItem(
          "roles",
          JSON.stringify(action.payload.user.roles)
        );
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
        // Lưu user info
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        // Lưu token
        localStorage.setItem("accessToken", action.payload.token);
        // Lưu roles vào state và localStorage
        if (action.payload.user && action.payload.user.roles) {
          state.roles = action.payload.user.roles;
          localStorage.setItem(
            "roles",
            JSON.stringify(action.payload.user.roles)
          );
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null; // Xóa user khỏi Redux
        state.roles = []; // Xóa roles khỏi Redux
        localStorage.removeItem("user");
        localStorage.removeItem("roles");
        localStorage.removeItem("accessToken");
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
