import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "../services/adminService";

export const fetchAllUsers = createAsyncThunk(
  "/admin/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.getAllUsers();
      return response?.users?.users || []; // Lấy đúng mảng users từ API
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi không xác định");
    }
  }
);

//viet tam!!!!
export const deleteUser = createAsyncThunk(
  "/admin/deleteUser",
  async (_, { rejectWithValue }) => {
    try {
      return;
    } catch (error) {}
  }
);

export const fetchUserById = createAsyncThunk(
  "/admin/getUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await adminService.getUserById(userId);
      return response.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Lỗi khi lấy thông tin user"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "/admin/updateUser",
  async ({ user_id, ...userData }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateUserById(user_id, userData);
      return response.user; // API trả về user đã cập nhật
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi khi cập nhật user");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload; // Lưu user vào Redux store
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.map((user) =>
          user.user_id === action.payload.user_id ? action.payload : user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
