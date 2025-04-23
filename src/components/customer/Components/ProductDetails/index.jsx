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

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);

  // Check and get list of sizes, variants
  const hasSizes = product?.variants?.some((variant) => variant.size);
  const allSizes = hasSizes
    ? Array.from(
        new Set(
          product?.variants?.map((variant) => variant.size).filter(Boolean)
        )
      ).sort()
    : [];

  // Get unique variants by color
  const allVariants =
    product?.variants?.reduce((acc, variant) => {
      if (!acc.find((v) => v.color === variant.color)) {
        acc.push(variant);
      }
      return acc;
    }, []) || [];

  // Get representative image for each color
  const colorImages = allVariants.reduce((acc, variant) => {
    acc[variant.color] = variant.image_url;
    return acc;
  }, {});

  // Get unique images only (prevent duplicates in zoom)
  const uniqueImages = Array.from(
    new Set(product?.variants?.map((variant) => variant.image_url))
  );

  // Find variant based on size and color
  const findVariant = (size, color) => {
    if (!hasSizes) size = null;
    return (
      product?.variants?.find(
        (variant) => variant.size === size && variant.color === color
      ) || product?.variants?.[0]
    );
  };

  // Check if variant is available with the selected size
  const isVariantAvailable = (size, color) => {
    if (!hasSizes) size = null;
    return product?.variants?.some(
      (variant) => variant.size === size && variant.color === color
    );
  };

  useEffect(() => {
    if (product?.variants?.length > 0) {
      // Select defaults
      const firstSize = hasSizes ? allSizes[0] : null;
      const firstVariant = allVariants[0];
      const firstColor = firstVariant?.color || null;

      setSelectedSize(firstSize);
      setSelectedVariant(firstVariant);
      setCurrentImages([firstVariant?.image_url]);
    }
  }, [product, hasSizes]);

  const handleSelectSize = (size) => {
    setSelectedSize(size);
    const variant = findVariant(size, selectedVariant?.color);
    setSelectedVariant(variant);
    setQty(1);
    setCurrentImages([variant?.image_url]);
  };

  const handleSelectVariant = (variant) => {
    if (isVariantAvailable(selectedSize, variant.color)) {
      setSelectedVariant(variant);
      setQty(1);
      setCurrentImages([colorImages[variant.color] || variant?.image_url]);
    }
  };

  const handleQtyChange = (newQty) => {
    setQty(newQty);
  };

  const incrementQty = () => {
    if (qty < (selectedVariant?.stock || 1)) {
      setQty(qty + 1);
    }
  };

  const decrementQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      dispatch(
        addToCart({
          productId: product.product_id,
          variantId: selectedVariant.variant_id,
          quantity: qty,
        })
      );
    }
  };

  const handleBuyNow = () => {
    if (selectedVariant) {
      dispatch(
        buyNow({
          productId: product.product_id,
          variantId: selectedVariant.variant_id,
          quantity: qty,
        })
      );
    }
  };

  const isActiveProduct = isProductActive(product);
  if (!isActiveProduct) {
    return <div>This product or variant is not active</div>;
  }

  const stock = selectedVariant ? selectedVariant.stock : 0;
  const discount = product?.discount ? parseFloat(product?.discount) : 0;
  const originalPrice = selectedVariant ? parseFloat(selectedVariant.price) : 0;
  const discountedPrice = originalPrice * (1 - discount / 100);

  const shortDescription = product?.description?.substring(0, 150);
  const hasLongDescription = product?.description?.length > 150;

  return (
    <div className="product-details bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <div className="product-zoom-section">
        <ProductZoom
          images={uniqueImages || []}
          currentImage={selectedVariant?.image_url}
        />
      </div>

      <div className="product-info-section">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            {product?.product_name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm dear">
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

        <div className="p-4">
          <div className="flex flex-wrap items-center justify-between mb-4">
            <div className="flex items-baseline gap-2">
              {selectedVariant && (
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
            {selectedVariant && (
              <div className="flex items-center">
                <div className={`h-2 w-32 bg-gray-200 rounded-full mr-2`}>
                  <div
                    className={`h-full rounded-full ${
                      selectedVariant.stock > 10
                        ? "bg-green-500"
                        : selectedVariant.stock > 5
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        (selectedVariant.stock / 30) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <span
                  className={`text-xs font-medium ${
                    selectedVariant.stock > 10
                      ? "text-green-600"
                      : selectedVariant.stock > 5
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedVariant.stock} in stock
                </span>
              </div>
            )}
          </div>
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
                  {showFullDescription ? "Collapse" : "View more"}
                </button>
              )}
            </div>
          </div>
          {/* Size Selection */}
          {hasSizes && (
            <div className="my-4">
              <h2 className="text-md font-medium text-gray-800 mb-2">Size</h2>
              <div className="flex flex-wrap gap-2">
                {allSizes.reverse().map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSelectSize(size)}
                    className={`px-4 py-2 rounded-full text-sm border transition ${
                      selectedSize === size
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Variant Selection (Color + RAM + Storage) */}
          {allVariants.length > 0 && (
            <div className="my-4">
              <h2 className="text-md font-medium text-gray-800 mb-2">
                Configuration
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {allVariants.map((variant) => {
                  const isAvailable = isVariantAvailable(
                    selectedSize,
                    variant.color
                  );
                  return (
                    <motion.button
                      key={variant.variant_id}
                      whileHover={{ scale: isAvailable ? 1.03 : 1 }}
                      whileTap={{ scale: isAvailable ? 0.97 : 1 }}
                      onClick={() => handleSelectVariant(variant)}
                      disabled={!isAvailable}
                      className={`p-2 rounded-lg border-2 transition-all flex items-center gap-2 ${
                        selectedVariant?.variant_id === variant.variant_id &&
                        isAvailable
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                          : "border-gray-200"
                      } ${
                        !isAvailable
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={variant.image_url}
                        alt={variant.color}
                        className="w-8 h-8 rounded object-cover border"
                      />
                      <span className="text-sm font-medium">
                        {variant.color}
                        {variant.ram ? ` - ${variant.ram}GB` : ""}
                        {variant.storage ? `/${variant.storage}GB` : ""}
                      </span>

                      {selectedVariant?.variant_id === variant.variant_id &&
                        isAvailable && (
                          <FaCheck
                            className="text-indigo-600 ml-auto"
                            size={12}
                          />
                        )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}
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
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
              <BsShieldCheck className="text-indigo-600" size={16} />
              <span className="text-sm text-gray-700">12-month warranty</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
              <MdLocalShipping className="text-indigo-600" size={16} />
              <span className="text-sm text-gray-700">Free shipping</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
              <FaExchangeAlt className="text-indigo-600" size={16} />
              <span className="text-sm text-gray-700">7-day returns</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
              <FaCheck className="text-indigo-600" size={16} />
              <span className="text-sm text-gray-700">Authentic product</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBuyNow}
              disabled={!selectedVariant}
              className="flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Buy now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={!selectedVariant}
              className="flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <MdOutlineShoppingCart size={20} />
              Add to cart
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsComponent;
