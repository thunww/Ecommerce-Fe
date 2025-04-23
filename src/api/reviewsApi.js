// src/services/reviewsApi.js
import axiosClient from "./axiosClient";

const reviewsApi = {
  getReviewsByProductId: (productId) =>
    axiosClient.get(`/reviews/${productId}`),
  createReview: (productId, data) =>
    axiosClient.post(`/reviews/products/${productId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  updateReview: (reviewId, data) =>
    axiosClient.put(`/reviews/${reviewId}`, data),

  deleteReview: (reviewId) => axiosClient.delete(`/reviews/${reviewId}`),
};

export default reviewsApi;
