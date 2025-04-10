import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviewsByProductId } from "../../../../redux/reviewsSilce";
import dayjs from "dayjs";

const ProductReviewSection = ({ productId }) => {
  const dispatch = useDispatch();
  const { reviews, loading } = useSelector((state) => state.reviews);
  const [expandedReviews, setExpandedReviews] = useState({});

  useEffect(() => {
    if (productId) {
      dispatch(fetchReviewsByProductId(productId));
    }
  }, [dispatch, productId]);

  const toggleExpandReview = (reviewId) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  // Calculate average rating
  const averageRating =
    Array.isArray(reviews) && reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="mt-12 border-t pt-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Product Reviews</h2>
        {Array.isArray(reviews) && reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-500 text-lg">
              {"★".repeat(Math.round(averageRating))}
              {"☆".repeat(5 - Math.round(averageRating))}
            </div>
            <span className="font-medium">{averageRating}/5</span>
            <span className="text-gray-500">({reviews.length} reviews)</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      ) : Array.isArray(reviews) && reviews.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-500">
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => {
            const isExpanded = expandedReviews[review.review_id];
            const longComment = review.comment && review.comment.length > 150;

            return (
              <div
                key={review.review_id}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={
                        review.user?.profile_picture ||
                        "https://th.bing.com/th/id/OIP.ByNwhzY5vUBvdIEfMCqDogHaHa?rs=1&pid=ImgDetMain"
                      }
                      alt={review.user?.username || "User"}
                      className="w-12 h-12 rounded-full object-cover border border-gray-200"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {review.user?.username || "Anonymous"}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="text-yellow-500">
                            {"★".repeat(review.rating)}
                            {"☆".repeat(5 - review.rating)}
                          </div>
                          <span className="text-sm text-gray-500">
                            ({review.rating}/5)
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {dayjs(review.created_at).format("MMM D, YYYY")}
                      </span>
                    </div>

                    <div className="mt-3">
                      {longComment ? (
                        <>
                          <p className="text-gray-700">
                            {isExpanded
                              ? review.comment
                              : `${review.comment.substring(0, 150)}...`}
                          </p>
                          <button
                            onClick={() => toggleExpandReview(review.review_id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1"
                          >
                            {isExpanded ? "Show less" : "Read more"}
                          </button>
                        </>
                      ) : (
                        <p className="text-gray-700">{review.comment}</p>
                      )}
                    </div>

                    {review.images && (
                      <div className="mt-4">
                        <img
                          src={review.images}
                          alt="Review attachment"
                          className="w-24 h-24 rounded-lg border border-gray-200 object-cover hover:opacity-90 transition-opacity cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {Array.isArray(reviews) && reviews.length > 3 && (
        <div className="mt-8 text-center">
          <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-6 rounded-md transition-colors">
            Load more reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductReviewSection;
