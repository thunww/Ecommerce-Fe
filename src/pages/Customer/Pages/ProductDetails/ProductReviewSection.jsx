import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviewsByProductId } from "../../../../redux/reviewsSilce";
import dayjs from "dayjs";

const ProductReviewSection = ({ productId }) => {
  const dispatch = useDispatch();
  const {
    reviews = [],
    loading,
    error,
  } = useSelector((state) => state.reviews);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [page, setPage] = useState(1);
  const reviewsPerPage = 3;

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

  // Filter only verified reviews
  const verifiedReviews = useMemo(() => {
    if (!Array.isArray(reviews)) return [];
    return reviews.filter((review) => review.is_verified === true);
  }, [reviews]);

  // Calculate average rating for verified reviews
  const averageRating = useMemo(() => {
    if (verifiedReviews.length === 0) return 0;
    return (
      verifiedReviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
      verifiedReviews.length
    ).toFixed(1);
  }, [verifiedReviews]);

  // Paginate verified reviews
  const paginatedReviews = useMemo(() => {
    return verifiedReviews.slice(0, page * reviewsPerPage);
  }, [verifiedReviews, page]);

  // Handle load more
  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  // Handle error state
  if (error) {
    return (
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Product Reviews
        </h2>
        <div className="bg-red-50 rounded-lg p-6 text-center">
          <p className="text-red-500">Failed to load reviews: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 border-t pt-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Product Reviews</h2>
        {verifiedReviews.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-500 text-lg">
              {"★".repeat(Math.round(averageRating))}
              {"☆".repeat(5 - Math.round(averageRating))}
            </div>
            <span className="font-medium">{averageRating}/5</span>
            <span className="text-gray-500">
              ({verifiedReviews.length} verified reviews)
            </span>
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
      ) : verifiedReviews.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-500">
            No verified reviews yet. Be the first to leave a verified review!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {paginatedReviews.map((review) => {
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
                      onError={(e) => (e.target.src = "/placeholder.png")}
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
                            {"★".repeat(review.rating || 0)}
                            {"☆".repeat(5 - (review.rating || 0))}
                          </div>
                          <span className="text-sm text-gray-500">
                            ({review.rating || 0}/5)
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {review.created_at
                          ? dayjs(review.created_at).format("MMM D, YYYY")
                          : "Unknown Date"}
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
                        <p className="text-gray-700">
                          {review.comment || "No comment provided"}
                        </p>
                      )}
                    </div>

                    {review.images && Array.isArray(review.images) ? (
                      <div className="mt-4 flex gap-2">
                        {review.images.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Review attachment ${index + 1}`}
                            className="w-24 h-24 rounded-lg border border-gray-200 object-cover hover:opacity-90 transition-opacity cursor-pointer"
                            onError={(e) => (e.target.src = "/placeholder.png")}
                          />
                        ))}
                      </div>
                    ) : review.images ? (
                      <div className="mt-4">
                        <img
                          src={review.images}
                          alt="Review attachment"
                          className="w-24 h-24 rounded-lg border border-gray-200 object-cover hover:opacity-90 transition-opacity cursor-pointer"
                          onError={(e) => (e.target.src = "/placeholder.png")}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {verifiedReviews.length > paginatedReviews.length && (
        <div className="mt-8 text-center">
          <button
            onClick={handleLoadMore}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-6 rounded-md transition-colors"
          >
            Load more verified reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductReviewSection;
