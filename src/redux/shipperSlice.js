import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for shipper registration
export const registerShipper = createAsyncThunk(
  'shipper/register',
  async (shipperData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/shippers/register', shipperData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  success: false,
  shipper: null
};

const shipperSlice = createSlice({
  name: 'shipper',
  initialState,
  reducers: {
    resetShipperState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.shipper = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register shipper
      .addCase(registerShipper.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerShipper.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.shipper = action.payload;
      })
      .addCase(registerShipper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Đăng ký thất bại';
      });
  }
});

export const { resetShipperState } = shipperSlice.actions;
export default shipperSlice.reducer; 