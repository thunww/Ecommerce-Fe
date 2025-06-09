import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Rating from "@mui/material/Rating";
import { Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineShoppingCart, MdLocalShipping } from "react-icons/md";
import { FaRegHeart, FaCheck, FaExchangeAlt } from "react-icons/fa";
import { BsShieldCheck } from "react-icons/bs";
import ProductZoom from "../../../../components/customer/Components/ProductZoom";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../../../redux/slices/cartSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formatVND = (price) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    price
  );

const isProductActive = (product) => {
  return product?.status === "active";
};

const ProductDetailsComponent = ({
  product,
  selectedVariant,
  onVariantChange,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  // Kiểm tra xem sản phẩm có variant hay không
  const hasVariants = product?.variants?.length > 0;
  const isSingleVariant = product?.variants?.length === 1;

  // Lấy thông tin variant được chọn (nếu có)
  const selected = hasVariants ? product?.variants?.[selectedVariant] : null;

  // Tự động chọn variant đầu tiên khả dụng
  useEffect(() => {
    if (hasVariants && selectedVariant === null) {
      const firstAvailableVariant = product.variants.findIndex(
        (v) => v.stock > 0
      );
      onVariantChange(firstAvailableVariant !== -1 ? firstAvailableVariant : 0);
    }
  }, [hasVariants, selectedVariant, onVariantChange, product]);

  // Lấy danh sách các thuộc tính khả dụng
  const allowedSizes = ["S", "M", "L"];
  const attributes = useMemo(() => {
    const attrs = {
      size: new Set(),
      color: new Set(),
      material: new Set(),
      ram: new Set(),
      storage: new Set(),
    };

    product?.variants?.forEach((variant) => {
      if (variant.size) {
        variant.size
          .split(",")
          .map((s) => s.trim())
          .filter((s) => allowedSizes.includes(s))
          .forEach((s) => attrs.size.add(s));
      }
      if (variant.color) attrs.color.add(variant.color);
      if (variant.material) attrs.material.add(variant.material);
      if (variant.ram) attrs.ram.add(variant.ram);
      if (variant.storage) attrs.storage.add(variant.storage);
    });

    return Object.fromEntries(
      Object.entries(attrs)
        .map(([key, value]) => [key, Array.from(value)])
        .filter(([_, value]) => value.length > 0)
    );
  }, [product]);

  // Lọc các variant khả dụng dựa trên thuộc tính đã chọn
  const availableVariants = useMemo(() => {
    return (
      product?.variants?.filter((variant) => {
        return Object.entries(selectedAttributes).every(([key, value]) => {
          if (!variant[key]) return true;
          return typeof variant[key] === "string"
            ? variant[key].toLowerCase() === value.toLowerCase()
            : variant[key].toString() === value.toString();
        });
      }) || []
    );
  }, [product, selectedAttributes]);

  // Điều kiện để cho phép mua hoặc thêm vào giỏ hàng
  const isValidToBuy = Boolean(
    (attributes.size?.length > 0 ? selectedAttributes.size : true) &&
    (hasVariants ? selectedVariant !== null && selected?.variant_id : true)
  );

  // Cập nhật hình ảnh
  useEffect(() => {
    if (hasVariants && product?.variants?.length > 0) {
      const variantImages = product.variants.map(
        (v) => v.image_url || "https://via.placeholder.com/150"
      );
      setCurrentImages(variantImages);
    } else {
      setCurrentImages([
        product?.image_url || "https://via.placeholder.com/150",
      ]);
    }
  }, [product, hasVariants]);

  const handleSelectAttribute = (attribute, value) => {
    const newAttributes = { ...selectedAttributes, [attribute]: value };
    setSelectedAttributes(newAttributes);

    // Tìm variant phù hợp với các thuộc tính đã chọn
    const matchingVariantIndex = product.variants.findIndex((v) =>
      Object.entries(newAttributes).every(([key, val]) =>
        !v[key]
          ? true
          : typeof v[key] === "string"
            ? v[key].toLowerCase() === val.toLowerCase()
            : v[key].toString() === val.toString()
      )
    );

    if (matchingVariantIndex !== -1) {
      onVariantChange(matchingVariantIndex);
      setQty(1);
      const selectedVariantImage =
        product.variants[matchingVariantIndex].image_url;
      if (selectedVariantImage) {
        setCurrentImages([selectedVariantImage]);
      }
    }
  };

  const handleQtyChange = (newQty) => {
    setQty(newQty);
  };

  const incrementQty = () => {
    if (qty < (stock || 1)) {
      setQty(qty + 1);
    }
  };

  const decrementQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  // Kiểm tra sản phẩm có active không
  const isActiveProduct = isProductActive(product);
  if (!isActiveProduct) {
    return <div>This product or variant is not active</div>;
  }

  // Tính giá và tồn kho
  const discount = product?.discount ? parseFloat(product?.discount) : 0;
  const originalPrice = selected
    ? parseFloat(selected.price)
    : parseFloat(product?.price || 0);
  const discountedPrice = originalPrice * (1 - discount / 100);
  const stock = selected ? selected.stock : product?.stock || 0;

  // Mô tả sản phẩm
  const shortDescription = product?.description?.substring(0, 150);
  const hasLongDescription = product?.description?.length > 150;
  const user = useSelector((state) => state.auth.user); // Thêm dòng này

  const handleBuyNow = async () => {

    if (!user) {
      toast.warning("Vui lòng đăng nhập để mua hàng");
      navigate("/login");
      return;
    }

    if (hasVariants && !selected) {
      toast.error("Vui lòng chọn sản phẩm");
      return;
    }

    if (!isValidToBuy) {
      toast.error("Vui lòng chọn đầy đủ các thuộc tính hợp lệ trước khi mua");
      return;
    }

    if (qty > stock) {
      toast.error(`Số lượng tồn kho không đủ. Chỉ còn ${stock} sản phẩm`);
      return;
    }

    try {
      const result = await dispatch(
        addToCart({
          product_id: product.product_id,
          quantity: qty,
          variant_id: selected?.variant_id || null,
        })
      ).unwrap();

      const matchedItem = result.items.find(
        (item) =>
          item.product.product_id === product.product_id &&
          item.variant?.variant_id === (selected?.variant_id || null)
      );

      if (!matchedItem) {
        toast.error("Không xác định được sản phẩm vừa thêm");
        return;
      }

      navigate("/cart", {
        replace: true, // bắt buộc để router cập nhật state mới
        state: { buyNowItemId: matchedItem.cart_item_id },
      });
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error(error.message || "Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  };

  const handleAddToCart = async () => {

    if (!user) {
      toast.warning("Vui lòng đăng nhập để mua hàng");
      navigate("/login");
      return;
    }
    if (hasVariants && !selected) {
      toast.error("Vui lòng chọn sản phẩm");
      return;
    }

    if (!isValidToBuy) {
      toast.error("Vui lòng chọn đầy đủ các thuộc tính hợp lệ trước khi mua");
      return;
    }

    if (qty > stock) {
      toast.error(`Số lượng tồn kho không đủ. Chỉ còn ${stock} sản phẩm`);
      return;
    }

    try {
      await dispatch(
        addToCart({
          product_id: product.product_id,
          quantity: qty,
          variant_id: selected?.variant_id || null,
        })
      ).unwrap();
      toast.success("Đã thêm vào giỏ hàng");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error(error.message || "Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  };

  return (
    <div className="product-details bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <div className="product-zoom-section">
        <ProductZoom
          images={currentImages || []}
          currentImage={
            selected?.image_url ||
            product?.image_url ||
            "https://via.placeholder.com/150"
          }
        />
      </div>

      <div className="product-info-section">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            {product?.product_name || "Sản phẩm không xác định"}
          </h1>
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

        <div className="p-4">
          <div className="flex flex-wrap items-center justify-between mb-4">
            <div className="flex items-baseline gap-2">
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
            </div>
            {stock > 0 && (
              <div className="flex items-center">
                <div className="h-2 w-32 bg-gray-200 rounded-full mr-2">
                  <div
                    className={`h-full rounded-full ${stock > 10
                      ? "bg-green-500"
                      : stock > 5
                        ? "bg-yellow-500"
                        : "bg-red-500"
                      }`}
                    style={{
                      width: `${Math.min((stock / 30) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
                <span
                  className={`text-xs font-medium ${stock > 10
                    ? "text-green-600"
                    : stock > 5
                      ? "text-yellow-600"
                      : "text-red-600"
                    }`}
                >
                  {stock} in stock
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
                ? product?.description || "Không có mô tả"
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

          {/* Attributes Selection */}
          {hasVariants && Object.keys(attributes).length > 0 && (
            <div className="my-4">
              <h2 className="text-md font-medium text-gray-800 mb-2">
                Configuration
              </h2>
              {Object.entries(attributes).map(([attribute, values]) => (
                <div key={attribute} className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 capitalize">
                    {attribute}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {values.map((value) => {
                      const isAvailable = product.variants.some(
                        (v) =>
                          v[attribute] != null &&
                          (typeof v[attribute] === "string"
                            ? v[attribute].toLowerCase() === value.toLowerCase()
                            : v[attribute].toString() === value.toString()) &&
                          v.stock > 0 &&
                          Object.entries(selectedAttributes)
                            .filter(([k]) => k !== attribute)
                            .every(([k, val]) =>
                              !v[k]
                                ? true
                                : typeof v[k] === "string"
                                  ? v[k].toLowerCase() === val.toLowerCase()
                                  : v[k].toString() === val.toString()
                            )
                      );
                      return (
                        <motion.button
                          key={value}
                          whileHover={{ scale: isAvailable ? 1.03 : 1 }}
                          whileTap={{ scale: isAvailable ? 0.97 : 1 }}
                          onClick={() => {
                            if (isAvailable) {
                              handleSelectAttribute(attribute, value);
                            }
                          }}
                          disabled={!isAvailable}
                          className={`px-4 py-2 rounded-full text-sm border transition-all ${selectedAttributes[attribute]
                            ?.toString()
                            .toLowerCase() ===
                            value.toString().toLowerCase() && isAvailable
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-gray-700 border-gray-300"
                            } ${!isAvailable
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-indigo-50"
                            }`}
                        >
                          {value}
                          {!isAvailable && (
                            <span className="ml-1 text-red-500 text-xs">
                              (Hết hàng)
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Hiển thị thông tin variant nếu chỉ có một variant */}
          {isSingleVariant && selected && (
            <div className="my-4">
              <h2 className="text-md font-medium text-gray-800 mb-2">
                Configuration
              </h2>
              <div className="text-gray-600">
                {Object.entries(selected)
                  .filter(([key, value]) => value && attributes[key])
                  .map(([key, value]) => (
                    <span key={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                      {key !== Object.keys(attributes).slice(-1)[0] ? ", " : ""}
                    </span>
                  ))}
              </div>
            </div>
          )}

          <div className="my-4">
            <h2 className="text-md font-medium text-gray-800 mb-2">Quantity</h2>
            <div className="flex items-center">
              <button
                onClick={decrementQty}
                disabled={qty <= 1}
                className={`w-8 h-8 flex items-center justify-center rounded-l-lg border border-r-0 ${qty <= 1
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
                className={`w-8 h-8 flex items-center justify-center rounded-r-lg border border-l-0 ${qty >= stock
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
              disabled={!isValidToBuy}
              className="flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Buy now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={!isValidToBuy}
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
