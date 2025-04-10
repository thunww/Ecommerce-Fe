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
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi khi cập nhật user");
    }
  }
);

export const banUser = createAsyncThunk(
  "admin/banUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await adminService.banUser(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi khi ban user");
    }
  }
);

export const unbanUser = createAsyncThunk(
  "admin/unbanUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await adminService.unbanUser(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi khi unban user");
    }
  }
);

export const assignRoleToUser = createAsyncThunk(
  "admin/assign-role",
  async ({ userId, roleId }, { rejectWithValue }) => {
    try {
      const response = await adminService.assignRoleToUser(userId, roleId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Lỗi khi assign-role user"
      );
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  "admin/uploadAvatar",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await adminService.uploadAvatar(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi khi upload avatar");
    }
  }
);
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    selectedUser: null,
    avatar: null,
    loading: false,
    error: null,
  },
  reducers: {
    updateUserStatus: (state, action) => {
      const { userId, status } = action.payload;
      const user = state.users.find((user) => user.user_id === userId);
      if (user) {
        user.status = status;
      }
    },
  },
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
        state.selectedUser = action.payload;
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
      })
      //banUser
      .addCase(banUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(banUser.fulfilled, (state, action) => {
        state.loading = false;
        const userId = action.meta.arg; // userId truyền vào action
        state.users = state.users.map((user) =>
          user.user_id === userId ? { ...user, status: "banned" } : user
        );
      })
      .addCase(banUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //UnBan
      .addCase(unbanUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unbanUser.fulfilled, (state, action) => {
        state.loading = false;
        const userId = action.meta.arg; // userId truyền vào action
        state.users = state.users.map((user) =>
          user.user_id === userId ? { ...user, status: "active" } : user
        );
      })
      .addCase(unbanUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(assignRoleToUser.fulfilled, (state, action) => {
        state.users = state.users.map((user) =>
          user.user_id === action.payload.userId
            ? { ...user, roles: [...user.roles, action.payload.role] }
            : user
        );
      })

      // Handle upload avatar
      .addCase(uploadAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.loading = false;
        // You can store the uploaded avatar URL or path if needed
        state.avatar = action.payload.avatar;
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateUserStatus } = adminSlice.actions;
export default adminSlice.reducer;
