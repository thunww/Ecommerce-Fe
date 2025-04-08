import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Rating from "@mui/material/Rating";
import { Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineShoppingCart, MdLocalShipping } from "react-icons/md";
import { FaRegHeart, FaCheck, FaExchangeAlt } from "react-icons/fa";
import { BsShieldCheck } from "react-icons/bs";
import ProductZoom from "../../../../components/customer/Components/ProductZoom";

const formatVND = (price) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    price
  );
const isProductActive = (product) => {
  return product?.status === "active";
};

const ProductDetailsComponent = () => {
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.products);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [currentImages, setCurrentImages] = useState([]); // State để lưu hình ảnh hiện tại cho ProductZoom

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(0);

      const variantImages = product.variants.map((v) => v.image_url);
      setCurrentImages(variantImages); // All variant images
    }
  }, [product]);
  const handleSelectVariant = (index) => {
    setSelectedVariant(index);
    setQty(1);
    const selectedVariantImage = product?.variants[index]?.image_url;
    if (selectedVariantImage) {
      setCurrentImages([selectedVariantImage]); // Nếu bạn muốn chỉ 1 ảnh => OK
    }
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

  const isActiveProduct = isProductActive(product);
  if (!isActiveProduct) {
    return <div>This product or variant is not active</div>;
  }

  const selected = product?.variants?.[selectedVariant];
  const stock = selected ? selected.stock : 0;

  // Calculate the discounted price
  const discount = product?.discount ? parseFloat(product?.discount) : 0;
  const originalPrice = selected ? parseFloat(selected.price) : 0;
  const discountedPrice = originalPrice * (1 - discount / 100);

  // Truncate description for initial view
  const shortDescription = product?.description?.substring(0, 150);
  const hasLongDescription = product?.description?.length > 150;

  const hasValidVariant = product?.variants?.some(
    (variant) => variant.size || variant.ram || variant.storage
  );

  return (
    <div className="product-details bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {/* Left Column: Product Zoom */}
      <div className="product-zoom-section">
        <ProductZoom images={currentImages} /> {/* Truyền danh sách hình ảnh */}
      </div>

      {/* Right Column: Product Details */}
      <div className="product-info-section">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            {product?.product_name}
          </h1>

          {/* Product meta info */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
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
        <div className="p-4">
          {/* Price & Stock */}
          <div className="flex flex-wrap items-center justify-between mb-4">
            <div className="flex items-baseline gap-2">
              {selected && (
                <>
                  <span className="text-2xl font-semibold text-red-600">
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
          <div className="mb-4">
            <h2 className="text-md font-medium text-gray-800 mb-2">
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

          {/* Variants with Color Display */}
          {hasValidVariant && (
            <div className="my-4">
              <h2 className="text-md font-medium text-gray-800 mb-2">
                Choose Variant
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {product?.variants?.map((variant, index) => (
                  <motion.button
                    key={variant.variant_id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSelectVariant(index)}
                    className={`p-2 rounded-lg border-2 transition-all flex items-center gap-2 ${
                      selectedVariant === index
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={variant.image_url}
                      alt={variant.color}
                      className="w-10 h-10 rounded object-cover border"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-medium">
                        {variant.color}
                      </span>
                      <span className="text-xs text-gray-500">
                        {variant.size && `${variant.size} / `}
                        {variant.ram && `${variant.ram}GB RAM / `}
                        {variant.storage && `${variant.storage}GB Storage`}
                      </span>
                    </div>
                    {selectedVariant === index && (
                      <FaCheck className="text-indigo-600 ml-auto" size={14} />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity selector */}
          <div className="my-4">
            <h2 className="text-md font-medium text-gray-800 mb-2">Quantity</h2>
            <div className="flex items-center">
              <button
                onClick={decrementQty}
                disabled={qty <= 1}
                className={`w-8 h-8 flex items-center justify-center rounded-l-lg border border-r-0 ${
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
                className="w-12 h-8 text-center border-y outline-none"
              />
              <button
                onClick={incrementQty}
                disabled={qty >= stock}
                className={`w-8 h-8 flex items-center justify-center rounded-r-lg border border-l-0 ${
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
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
              <BsShieldCheck className="text-indigo-600" size={16} />
              <span className="text-sm text-gray-700">12 Months Warranty</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
              <MdLocalShipping className="text-indigo-600" size={16} />
              <span className="text-sm text-gray-700">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
              <FaExchangeAlt className="text-indigo-600" size={16} />
              <span className="text-sm text-gray-700">7-Day Returns</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
              <FaCheck className="text-indigo-600" size={16} />
              <span className="text-sm text-gray-700">100% Authentic</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!selected}
              className="flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Buy Now
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!selected}
              className="flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <MdOutlineShoppingCart size={20} />
              Add to Cart
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsComponent;
