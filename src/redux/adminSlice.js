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

export const getUserById = createAsyncThunk(
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

      // Get user by ID
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
