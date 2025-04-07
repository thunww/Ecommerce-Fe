import React from "react";
import "../ProductItem/style.css";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { FaRegHeart } from "react-icons/fa";
import { GoGitCompare } from "react-icons/go";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { MdOutlineShoppingCart } from "react-icons/md";

const ProductItemImages = ({ product }) => {
  if (!product) {
    return <div>Loading...</div>;
  }

  const discount = product?.discount ? parseFloat(product?.discount) : 0;
  const originalPrice = parseFloat(product?.variants[0]?.price);
  const discountedPrice = originalPrice * (1 - discount / 100);

  return (
    <div className="productItem shadow-lg py-5 rounded-md overflow-hidden border-1 border-[rgba(0,0,0,0.1)] flex items-center">
      {/* Image Wrapper */}
      <div className="group imgWrapper w-[25%] overflow-hidden rounded-md relative">
        <Link to={`/product/${product?.id}`}>
          <div className="img h-[200px] overflow-hidden relative">
            <img
              src={product.variants?.[0]?.image_url || "default_image_url"}
              className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
              alt={product?.product_name}
            />
          </div>
        </Link>
        {discount > 0 && (
          <span
            className="discount flex items-center absolute top-[10px] left-[10px] z-50 bg-red-400
                   text-white rounded-lg p-1 text-[12px] font-[500]"
          >
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Product Information */}
      <div className="info p-3 py-5 px-8 w-[75%]">
        {/* Category */}
        <h6 className="text-[15px] !font-[400] text-gray-600">
          <Link
            to={`/category/${product?.category_id}`}
            className="link hover:text-blue-500"
          >
            {product?.category_name}
          </Link>
        </h6>

        {/* Product Name */}
        <h3 className="text-[18px] title mt-3 mb-3 font-[500] mb-1 text-[#000] hover:text-indigo-600 transition-colors duration-200">
          <Link to={`/product/${product?.id}`} className="link transition-all">
            {product?.product_name}
          </Link>
        </h3>

        {/* Product Description */}
        <p className="text-[14px] text-gray-500">{product?.description}</p>

        {/* Rating */}
        <Rating
          name="size-small"
          value={product?.average_rating}
          size="small"
          readOnly
        />

        {/* Price Display */}
        <div className="flex items-center gap-4">
          {originalPrice > 0 && (
            <span className="oldPrice line-through text-gray-500 text-[15px] font-[500]">
              ${originalPrice.toFixed(2)}
            </span>
          )}
          {discountedPrice > 0 && (
            <span className="price text-red-500 text-[15px] font-[600]">
              ${discountedPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <div className="mt-3">
          <Button className="btn-org flex gap-2 text-white bg-blue-500 hover:bg-blue-600">
            <MdOutlineShoppingCart className="text-[20px]" />
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductItemImages;
