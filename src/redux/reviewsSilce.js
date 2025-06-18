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

// Lấy tất cả review của user
export const fetchReviewsByUser = createAsyncThunk(
  "reviews/fetchReviewsByUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await reviewsService.getReviewsByUser();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch user reviews"
      );
    }
  }
);

// Lấy tất cả review cho admin
export const fetchAllReviews = createAsyncThunk(
  "reviews/fetchAllReviews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await reviewsService.getAllReviews();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch all reviews"
      );
    }
  }
);

// Lấy chi tiết 1 review
export const fetchReviewById = createAsyncThunk(
  "reviews/fetchReviewById",
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await reviewsService.getReviewById(reviewId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch review");
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

export const updateReviewStatus = createAsyncThunk(
  "reviews/updateReviewStatus",
  async ({ reviewId, statusData }, { rejectWithValue }) => {
    try {
      const response = await reviewsService.updateReviewStatus(
        reviewId,
        statusData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update review status"
      );
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
    reviewDetail: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- GET BY PRODUCT ID ---
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

      // --- GET BY USER ---
      .addCase(fetchReviewsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- GET ALL (admin) ---
      .addCase(fetchAllReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- GET ONE ---
      .addCase(fetchReviewById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewById.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewDetail = action.payload;
      })
      .addCase(fetchReviewById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- CREATE ---
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

      // --- UPDATE ---
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(
          (r) => r.review_id === action.payload.review_id
        );
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })

      // --- UPDATE STATUS ---
      .addCase(updateReviewStatus.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(
          (r) => r.review_id === action.payload.review_id
        );
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })

      // --- DELETE ---
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(
          (r) => r.review_id !== action.payload
        );
      });
  },
});

export default reviewSlice.reducer;
