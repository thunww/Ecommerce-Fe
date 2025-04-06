import React from "react";
import "../ProductItem/style.css";
import { Link } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa"; // Thêm các icon sao từ react-icons

const ProductItem = ({ product }) => {
  // Định dạng giá sản phẩm
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(parseFloat(product.price));

  const discount = parseFloat(product.discount);
  const priceAfterDiscount = discount
    ? parseFloat(product.price) * (1 - discount / 100)
    : parseFloat(product.price);

  const formattedPriceAfterDiscount = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(priceAfterDiscount);

  const renderRatingStars = (rating) => {
    const totalStars = 5;
    let stars = [];

    // Render sao đầy đủ
    for (let i = 0; i < Math.floor(rating); i++) {
      stars.push(<FaStar key={`filled-${i}`} className="text-amber-400" />);
    }

    // Render sao trống
    for (let i = Math.floor(rating); i < totalStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-amber-400" />);
    }

    return stars;
  };

  const averageRating = product.reviews?.length
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
      product.reviews.length
    : 0;

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100">
      {/* Badge giảm giá */}
      {product.discount && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
            -{discount.toFixed(0)}%
          </span>
        </div>
      )}

      {/* Hình ảnh sản phẩm */}
      <div className="relative overflow-hidden aspect-square">
        <Link to={`/product/${product.product_id}`}>
          <img
            src={product.images?.[0]?.image_url}
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
            alt={product.product_name}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        </Link>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-800 text-base mb-2 line-clamp-2 h-12 group-hover:text-indigo-600 transition-colors duration-200">
          <Link to={`/product/${product.product_id}`}>
            {product.product_name}
          </Link>
        </h3>

        <div className="flex flex-col mb-4">
          <span className="text-lg font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
            {formattedPriceAfterDiscount}
          </span>

          {product.discount && (
            <span className="text-gray-500 line-through text-xs mt-1">
              {formattedPrice}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex text-amber-400 text-xs">
            {averageRating > 0
              ? renderRatingStars(averageRating)
              : // Nếu không có đánh giá, chỉ hiển thị sao trống
                Array(5).fill(<FaRegStar className="text-amber-400" />)}
          </div>

          <div className="bg-gray-100 rounded-full px-2 py-1">
            <span className="text-xs text-gray-600 font-medium">
              {product.sold} sold
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
