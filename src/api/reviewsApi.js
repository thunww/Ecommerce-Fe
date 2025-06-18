import axiosClient from "./axiosClient";

const reviewsApi = {
  // Lấy danh sách review theo product_id (công khai)
  getReviewsByProductId: (productId) =>
    axiosClient.get(`/reviews/${productId}`),

  // Lấy 1 review theo review_id (dùng để edit hoặc xem chi tiết)
  getReviewById: (reviewId) => axiosClient.get(`/reviews/by-id/${reviewId}`),

  // Lấy tất cả reviews (cho admin)
  getAllReviews: () => axiosClient.get("/reviews/admin/all"),

  // Lấy tất cả reviews của user hiện tại (đã đăng nhập)
  getReviewsByUser: () => axiosClient.get("/reviews/user/all"),

  // Tạo mới review (có thể có ảnh)
  createReview: (productId, data) =>
    axiosClient.post(`/reviews/products/${productId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Cập nhật nội dung đánh giá (rating, comment, image)
  updateReview: (reviewId, data) =>
    axiosClient.put(`/reviews/${reviewId}`, data),

  // Cập nhật trạng thái xác minh review (dành cho admin)
  updateReviewStatus: (reviewId, data) =>
    axiosClient.put(`/reviews/${reviewId}/status`, data),

  // Xoá review
  deleteReview: (reviewId) => axiosClient.delete(`/reviews/${reviewId}`),
};

export default reviewsApi;
