import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reviewsService from "../services/reviewsService";

// Lấy danh sách review theo product_id
export const fetchReviewsByProductId = createAsyncThunk(
  "reviews/fetchReviewsByProductId",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await reviewsService.getReviewsByProductId(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch reviews");
    }
  }
);

// Tạo mới review
export const createReview = createAsyncThunk(
  "reviews/createReview",
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await reviewsService.createReview(productId, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create review");
    }
  }
);

// Cập nhật review
export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ reviewId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await reviewsService.updateReview(reviewId, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update review");
    }
  }
);

// Xóa review
export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      await reviewsService.deleteReview(reviewId);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete review");
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch reviews
      .addCase(fetchReviewsByProductId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsByProductId.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsByProductId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.push(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update review
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(
          (r) => r.review_id === action.payload.review_id
        );
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })

      // Delete review
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(
          (r) => r.review_id !== action.payload
        );
      });
  },
});

export default reviewSlice.reducer;
