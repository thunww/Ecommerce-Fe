import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiStar, FiX, FiCamera } from "react-icons/fi";
import { createReview } from "../../../../redux/reviewsSilce";

const RateModal = ({ isOpen, onClose, orderItem }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.reviews);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [image, setImage] = useState(null); // Only one image
  const [localError, setLocalError] = useState(null);

  const handleRating = (value) => {
    setRating(value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      if (file.type.startsWith("image/")) {
        setImage({
          file,
          preview: URL.createObjectURL(file),
        });
      } else {
        setLocalError("Please choose an image file.");
      }
    } else {
      setLocalError("No file selected.");
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setLocalError("Please select a rating!");
      return;
    }

    setLocalError(null);

    try {
      const formData = new FormData();
      formData.append("rating", rating);
      formData.append("comment", reviewText);

      if (image) {
        formData.append("image", image.file);
      }
      await dispatch(
        createReview({
          productId: orderItem.product.product_id,
          reviewData: formData,
        })
      ).unwrap();

      alert("Review submitted successfully!");
      setRating(0);
      setReviewText("");
      setImage(null);
      onClose();
    } catch (err) {
      console.error(err); // Log the error if any
      setLocalError("Failed to submit review. Please try again.");
    }
  };
  if (!isOpen || !orderItem) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FiX size={24} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Product Review
        </h2>

        {/* Product Info */}
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={orderItem.productVariant.image_url}
            alt={orderItem.product.product_name}
            className="w-16 h-16 rounded-md object-cover"
          />
          <div>
            <p className="text-base font-medium text-gray-800">
              {orderItem.product.product_name}
            </p>
            <p className="text-sm text-gray-500">
              Variant: {orderItem.productVariant.color}{" "}
              {orderItem.productVariant.size
                ? `- ${orderItem.productVariant.size}`
                : ""}
            </p>
          </div>
        </div>

        {/* Error message */}
        {(localError || error) && (
          <p className="text-red-500 text-sm mb-4">{localError || error}</p>
        )}

        {/* Rating */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Product Quality
          </p>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FiStar
                key={star}
                size={32}
                className={`cursor-pointer ${
                  star <= rating
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
                onClick={() => handleRating(star)}
              />
            ))}
          </div>
        </div>

        {/* Write Review */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Write your review
          </p>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your thoughts about the product..."
            className="w-full h-24 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
            maxLength={500}
          />
          <p className="text-xs text-gray-500 text-right">
            {reviewText.length}/500
          </p>
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Upload Image (Optional)
          </p>
          {image && (
            <div className="relative mb-2">
              <img
                src={image.preview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-md"
              />
              <button
                onClick={removeImage}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
              >
                <FiX size={12} />
              </button>
            </div>
          )}
          <label className="flex items-center justify-center w-20 h-20 border border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
            <FiCamera size={24} className="text-gray-500" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RateModal;
