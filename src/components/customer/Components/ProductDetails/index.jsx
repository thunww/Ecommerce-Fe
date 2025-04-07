import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Rating from "@mui/material/Rating";
import { Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineShoppingCart, MdLocalShipping } from "react-icons/md";
import { FaRegHeart, FaCheck, FaExchangeAlt } from "react-icons/fa";
import { BsShieldCheck } from "react-icons/bs";

const formatVND = (price) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    price
  );

const ProductDetailsComponent = () => {
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.products);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(0);
    }
  }, [product]);

  const handleSelectVariant = (index) => {
    setSelectedVariant(index);
    setQty(1);
  };

  const handleQtyChange = (newQty) => {
    setQty(newQty);
  };

  const incrementQty = () => {
    if (qty < (selected?.stock || 1)) {
      setQty(qty + 1);
    }
  };

  const decrementQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  const selected = product?.variants?.[selectedVariant];
  const stock = selected ? selected.stock : 0;

  // Calculate the discounted price
  const discount = product?.discount ? parseFloat(product?.discount) : 0;
  const originalPrice = selected ? parseFloat(selected.price) : 0;
  const discountedPrice = originalPrice * (1 - discount / 100);

  // Truncate description for initial view
  const shortDescription = product?.description?.substring(0, 150);
  const hasLongDescription = product?.description?.length > 150;

  return (
    <div className="product-details bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          {product?.product_name}
        </h1>

        {/* Product meta info with improved styling */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm">
            <span className="font-medium text-indigo-600 mr-1">
              {parseFloat(product?.average_rating || 0).toFixed(1)}
            </span>
            <Rating
              name="product-rating"
              value={parseFloat(product?.average_rating || 0)}
              size="small"
              readOnly
              className="text-amber-400"
            />
            <span className="text-gray-500 ml-1">
              ({product?.review_count?.toLocaleString() || 0})
            </span>
          </div>

          {product?.sold && (
            <div className="bg-white px-3 py-1 rounded-full shadow-sm">
              <span className="text-gray-600">
                {product?.sold < 1000
                  ? `${product?.sold} Sold`
                  : `${(product?.sold / 1000).toFixed(1)}k Sold`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="p-6">
        {/* Price & Stock with improved visibility */}
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div className="flex items-baseline gap-2">
            {selected && (
              <>
                <span className="text-3xl font-bold text-red-600">
                  {formatVND(discountedPrice)}
                </span>
                <span className="text-gray-400 line-through text-sm">
                  {formatVND(originalPrice)}
                </span>
                {discount > 0 && (
                  <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
                    -{discount}%
                  </span>
                )}
              </>
            )}
          </div>

          {selected && (
            <div className="flex items-center">
              <div className={`h-2 w-32 bg-gray-200 rounded-full mr-2`}>
                <div
                  className={`h-full rounded-full ${
                    selected.stock > 10
                      ? "bg-green-500"
                      : selected.stock > 5
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{
                    width: `${Math.min((selected.stock / 30) * 100, 100)}%`,
                  }}
                ></div>
              </div>
              <span
                className={`text-xs font-medium ${
                  selected.stock > 10
                    ? "text-green-600"
                    : selected.stock > 5
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {selected.stock} in stock
              </span>
            </div>
          )}
        </div>

        {/* Product Description with toggle */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-2">
            Product Description
          </h2>
          <div className="text-gray-600 leading-relaxed">
            {showFullDescription || !hasLongDescription
              ? product?.description
              : `${shortDescription}...`}
            {hasLongDescription && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-indigo-600 font-medium hover:underline ml-1"
              >
                {showFullDescription ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        </div>

        {/* Variants with better visual hierarchy */}
        <div className="my-6">
          <h2 className="text-lg font-medium text-gray-800 mb-3">
            Choose Variant
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {product?.variants?.map((variant, index) => (
              <motion.button
                key={variant.variant_id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelectVariant(index)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedVariant === index
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">
                    {variant.size} / {variant.ram}GB
                  </span>
                  {selectedVariant === index && (
                    <FaCheck className="text-indigo-600" size={14} />
                  )}
                </div>
                <div className="text-xs text-gray-500">{variant.storage}GB</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Quantity selector with modern styling */}
        <div className="my-6">
          <h2 className="text-lg font-medium text-gray-800 mb-3">Quantity</h2>
          <div className="flex items-center">
            <button
              onClick={decrementQty}
              disabled={qty <= 1}
              className={`w-10 h-10 flex items-center justify-center rounded-l-lg border border-r-0 ${
                qty <= 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              -
            </button>
            <input
              type="number"
              min="1"
              max={stock}
              value={qty}
              onChange={(e) => handleQtyChange(parseInt(e.target.value) || 1)}
              className="w-16 h-10 text-center border-y outline-none"
            />
            <button
              onClick={incrementQty}
              disabled={qty >= stock}
              className={`w-10 h-10 flex items-center justify-center rounded-r-lg border border-l-0 ${
                qty >= stock
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              +
            </button>
          </div>
        </div>

        {/* Product highlights */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
            <BsShieldCheck className="text-indigo-600" size={18} />
            <span className="text-sm text-gray-700">12 Months Warranty</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
            <MdLocalShipping className="text-indigo-600" size={18} />
            <span className="text-sm text-gray-700">Free Shipping</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
            <FaExchangeAlt className="text-indigo-600" size={18} />
            <span className="text-sm text-gray-700">7-Day Returns</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
            <FaCheck className="text-indigo-600" size={18} />
            <span className="text-sm text-gray-700">100% Authentic</span>
          </div>
        </div>

        {/* Action buttons with improved styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!selected}
            className="flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Buy Now
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!selected}
            className="flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <MdOutlineShoppingCart size={20} />
            Add to Cart
          </motion.button>
        </div>

        {/* Wishlist button */}
        <button className="flex items-center justify-center gap-2 w-full py-3 px-6 border border-gray-300 text-gray-700 rounded-xl mt-3 hover:bg-gray-50 transition-all">
          <FaRegHeart size={18} />
          <span className="font-medium">Add to Wishlist</span>
        </button>
      </div>
    </div>
  );
};

export default ProductDetailsComponent;
