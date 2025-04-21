import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import addressService from "../services/addressesService";

// Get all addresses
export const fetchAllAddresses = createAsyncThunk(
  "addresses/fetchAllAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await addressService.getAllAddresses();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch addresses"
      );
    }
  }
);

// Get address by ID
export const getAddressById = createAsyncThunk(
  "addresses/getAddressById",
  async (addressId, { rejectWithValue }) => {
    try {
      const response = await addressService.getAddressById(addressId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to get address");
    }
  }
);

// Create address
export const createAddress = createAsyncThunk(
  "addresses/createAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await addressService.createAddress(addressData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create address"
      );
    }
  }
);

// Update address
export const updateAddress = createAsyncThunk(
  "addresses/updateAddress",
  async ({ addressId, addressData }, { rejectWithValue }) => {
    try {
      const response = await addressService.updateAddress(
        addressId,
        addressData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update address"
      );
    }
  }
);

// Delete address
export const deleteAddress = createAsyncThunk(
  "addresses/deleteAddress",
  async (addressId, { rejectWithValue }) => {
    try {
      const response = await addressService.deleteAddress(addressId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete address"
      );
    }
  }
);

// Set default address
export const setDefaultAddress = createAsyncThunk(
  "addresses/setDefaultAddress",
  async (addressId, { rejectWithValue }) => {
    try {
      const response = await addressService.setDefaultAddress(addressId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to set default address"
      );
    }
  }
);

// Slice
const addressSlice = createSlice({
  name: "addresses",
  initialState: {
    addresses: [],
    selectedAddress: null,
    defaultAddress: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAllAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAddressById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAddressById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAddress = action.payload;
      })
      .addCase(getAddressById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload);
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateAddress.fulfilled, (state, action) => {
        const index = state.addresses.findIndex(
          (addr) => addr.address_id === action.payload.address_id
        );
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
      })

      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(
          (addr) => addr.address_id !== action.payload
        );
      })

      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.defaultAddress = action.payload;
        state.addresses = state.addresses.map((addr) => ({
          ...addr,
          is_default: addr.address_id === action.payload.address_id,
        }));
      });
  },
});

export default addressSlice.reducer;
