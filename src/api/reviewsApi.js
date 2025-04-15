// src/services/reviewsApi.js
import axiosClient from "./axiosClient";

const reviewsApi = {
  getReviewsByProductId: (productId) =>
    axiosClient.get(`/reviews/${productId}`),
  createReview: (data) => axiosClient.post("/reviews", data),

  updateReview: (reviewId, data) =>
    axiosClient.put(`/reviews/${reviewId}`, data),

  deleteReview: (reviewId) => axiosClient.delete(`/reviews/${reviewId}`),
};

export default reviewsApi;
