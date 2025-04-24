import reviewsApi from "../api/reviewsApi";

const reviewsService = {
  // Lấy danh sách review theo product_id
  getReviewsByProductId: async (productId) => {
    try {
      const response = await reviewsApi.getReviewsByProductId(productId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tạo review mới
  createReview: async (productId, reviewData) => {
    try {
      const response = await reviewsApi.createReview(productId, reviewData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật review
  updateReview: async (reviewId, updatedData) => {
    try {
      const response = await reviewsApi.updateReview(reviewId, updatedData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa review
  deleteReview: async (reviewId) => {
    try {
      const response = await reviewsApi.deleteReview(reviewId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default reviewsService;
