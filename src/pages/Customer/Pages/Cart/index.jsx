import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import { setSelectedItems } from "../../../../redux/slices/cartSlice";
import { ChevronDownIcon, XIcon } from "lucide-react";
import couponApi from "../../../../api/couponApi";

import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Divider,
  Box,
  IconButton,
  Grid,
  Chip,
  Alert,
  Paper,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as ShippingIcon,
  Tag as TagIcon,
  Delete as DeleteIcon,
  SentimentDissatisfied as EmptyIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import CartItem from "./CartItem";
import {
  fetchCart,
  updateCartItem,
  removeFromCart,
  applyCoupon,
  removeCoupon,
  validateCoupon,
  toggleSelectItem,
  clearSelectedItems,
  clearCoupon,
} from "../../../../redux/slices/cartSlice";
import "./Cart.css";
import {
  ShoppingCartIcon as HeroShoppingCartIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  FaceFrownIcon,
} from "@heroicons/react/24/outline";

const { Title, Text } = Typography;

const CartPage = () => {
  // Thêm state mới cho mã giảm giá
  const [showCouponList, setShowCouponList] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]); // Danh sách mã giảm giá
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  // Thêm function để lấy danh sách mã giảm giá
  const fetchAvailableCoupons = async () => {
    setLoadingCoupons(true);
    try {
      console.log("Fetching all coupons...");
      const response = await couponApi.getAllCoupons();
      console.log("Coupons response:", response.data); // Log để kiểm tra
      // Chuyển đổi dữ liệu từ API
      const formattedCoupons = (response.data.data || []).map((coupon) => ({
        coupon_id: coupon.coupon_id,
        code: coupon.code,
        discount_type: coupon.discount_percent ? "percentage" : "fixed", // Xác định loại giảm giá
        discount_value:
          coupon.discount_percent || coupon.max_discount_amount || 0,
        max_discount: coupon.max_discount_amount || null,
        min_order_amount: coupon.min_order_value || null,
      }));
      setAvailableCoupons(formattedCoupons);
      if (formattedCoupons.length === 0) {
        toast.info("Không có mã giảm giá nào khả dụng");
      }
    } catch (error) {
      console.error(
        "Không thể lấy danh sách mã giảm giá:",
        error.response?.data
      );
      toast.error(
        error.response?.data?.message || "Không thể lấy danh sách mã giảm giá"
      );
      setAvailableCoupons([]);
    } finally {
      setLoadingCoupons(false);
    }
  };

  // Thêm function xử lý chọn mã
  const handleSelectCoupon = async (couponCode) => {
    try {
      await dispatch(validateCoupon(couponCode)).unwrap();
      await dispatch(applyCoupon({ code: couponCode })).unwrap();
      await dispatch(fetchCart());
      setShowCouponList(false);
      toast.success("Áp dụng mã giảm giá thành công!");
    } catch (error) {
      toast.error(error.message || "Không thể áp dụng mã giảm giá");
    }
  };

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Lấy dữ liệu từ Redux store
  const {
    items = [],
    loading,
    error,
    selectedItems = [],
    coupon,
    discount,
    couponError,
  } = useSelector((state) => state.cart);
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // State cho biến thể được chọn
  const [selectedVariants, setSelectedVariants] = useState({});

  const [cartLoaded, setCartLoaded] = useState(false);

  useEffect(() => {
    dispatch(fetchCart()).then(() => setCartLoaded(true));
  }, [dispatch]);

  useEffect(() => {
    const itemIdFromNav = location.state?.buyNowItemId;

    if (cartLoaded && itemIdFromNav) {
      dispatch(setSelectedItems([itemIdFromNav]));
    }
  }, [cartLoaded, location.state?.buyNowItemId, dispatch]);

  const handleSelectAll = (checked) => {
    if (checked) {
      const allItemIds = items.map((item) => item.cart_item_id);
      dispatch(setSelectedItems(allItemIds));
    } else {
      dispatch(clearSelectedItems());
    }
  };

  const handleSelectShop = (checked, shopId) => {
    const shopItems = groupItemsByShop()[shopId].items;
    const shopItemIds = shopItems.map((item) => item.cart_item_id);

    if (checked) {
      // thêm tất cả shopItemIds vào selectedItems mà không trùng
      const newSelected = Array.from(
        new Set([...selectedItems, ...shopItemIds])
      );
      dispatch(setSelectedItems(newSelected));
    } else {
      // loại bỏ tất cả shopItemIds khỏi selectedItems
      const newSelected = selectedItems.filter(
        (id) => !shopItemIds.includes(id)
      );
      dispatch(setSelectedItems(newSelected));
    }
  };

  const handleSelectItem = (checked, cartItemId) => {
    if (checked) {
      // thêm nếu chưa có
      if (!selectedItems.includes(cartItemId)) {
        dispatch(setSelectedItems([...selectedItems, cartItemId]));
      }
    } else {
      // bỏ chọn
      dispatch(
        setSelectedItems(selectedItems.filter((id) => id !== cartItemId))
      );
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await dispatch(removeFromCart(cartItemId)).unwrap();
      setSelectedVariants((prev) => {
        const newVariants = { ...prev };
        delete newVariants[cartItemId];
        return newVariants;
      });
      await dispatch(fetchCart());
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
      console.log("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error) {
      console.error("Không thể xóa sản phẩm");
    }
  };

  // Xử lý thay đổi biến thể
  const handleVariantChange = (cartItemId, variantId) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [cartItemId]: variantId,
    }));
  };

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    try {
      await dispatch(
        updateCartItem({ cart_item_id: cartItemId, quantity: newQuantity })
      ).unwrap();
      console.log("Cập nhật số lượng thành công");
    } catch (error) {
      console.error(error.message || "Có lỗi xảy ra khi cập nhật số lượng");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      console.warn("Vui lòng nhập mã giảm giá");
      return;
    }

    setApplyingCoupon(true);

    try {
      // Gọi validateCoupon để kiểm tra hợp lệ
      await dispatch(validateCoupon(couponCode)).unwrap();

      // Nếu không lỗi → tiến hành applyCoupon
      await dispatch(applyCoupon({ code: couponCode })).unwrap();

      // Reset input và gọi lại giỏ hàng để cập nhật giảm giá
      setCouponCode("");
      await dispatch(fetchCart());
    } catch (error) {
      console.error("Coupon error:", error);
      console.error(error.message || "Có lỗi xảy ra khi áp dụng mã giảm giá");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await dispatch(removeCoupon()).unwrap(); // ✅ không truyền gì cả

      dispatch(clearCoupon());
      setCouponCode("");
      await dispatch(fetchCart());
    } catch (error) {
      console.error("Lỗi khi xóa mã giảm giá:", error);
      console.error(error.message || "Có lỗi xảy ra khi xóa mã giảm giá");
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.warn("Vui lòng chọn ít nhất một sản phẩm để thanh toán");

      return;
    }

    // Chuẩn bị dữ liệu cho trang checkout
    const checkoutData = {
      items: items.filter((item) => selectedItems.includes(item.cart_item_id)),
      variants: selectedVariants,
      total: calculateTotal(),
      couponCode,
    };

    // Lưu dữ liệu vào sessionStorage để sử dụng ở trang checkout
    sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData));

    // Chuyển đến trang checkout
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  console.log("Current cart items:", items);

  // HardCoded JSX để kiểm tra hiển thị
  const renderHardCodedCart = () => (
    <div
      className="cart-container"
      style={{ padding: "30px", background: "#f0f0f0" }}
    >
      <h2>Giỏ hàng của bạn (Hard Coded)</h2>
      <div
        style={{ background: "white", padding: "20px", borderRadius: "8px" }}
      >
        <p>Sản phẩm 1 - 150.000đ</p>
        <p>Sản phẩm 2 - 250.000đ</p>
        <hr />
        <p>
          <strong>Tổng cộng: 400.000đ</strong>
        </p>
        <Button type="primary">Thanh toán</Button>
      </div>
    </div>
  );

  // Kiểm tra xem có muốn sử dụng phiên bản hard-coded không
  const useHardCodedVersion = false;
  if (useHardCodedVersion) {
    return renderHardCodedCart();
  }

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">
          Đang tải giỏ hàng...
        </p>
      </div>
    );
  }

  // Nếu có lỗi nhưng vẫn có dữ liệu mẫu, vẫn hiển thị cart với dữ liệu mẫu
  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => dispatch(fetchCart())}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Hiển thị giỏ hàng trống nếu không có sản phẩm nào
  if (!items || items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 text-gray-400 mb-4">
          <HeroShoppingCartIcon />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Giỏ hàng của bạn đang trống
        </h2>
        <p className="text-gray-600 mb-6">
          Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
        </p>
        <button
          onClick={handleContinueShopping}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
        >
          <HeroShoppingCartIcon className="w-5 h-5" />
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const calculateSubtotal = () => {
    // Chỉ tính tổng giá của các sản phẩm được chọn
    return items
      .filter((item) => selectedItems.includes(item.cart_item_id))
      .reduce((total, item) => total + parseFloat(item.total_price), 0);
  };

  const calculateDiscount = () => {
    if (!coupon) return 0;

    const subtotal = calculateSubtotal();
    let discountAmount = 0;

    const discountValue = parseFloat(coupon.discount_value);
    const maxDiscount = coupon.max_discount
      ? parseFloat(coupon.max_discount)
      : null;

    if (coupon.discount_type === "percentage") {
      discountAmount = (subtotal * discountValue) / 100;
    } else if (coupon.discount_type === "fixed") {
      discountAmount = discountValue;
    }

    if (maxDiscount && discountAmount > maxDiscount) {
      discountAmount = maxDiscount;
    }

    return discountAmount;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    return subtotal - discount;
  };

  // Nhóm items theo shop
  const groupItemsByShop = () => {
    const groups = {};
    items.forEach((item) => {
      const shopId = item.product.shop.shop_id;
      if (!groups[shopId]) {
        groups[shopId] = {
          shop: item.product.shop,
          items: [],
        };
      }
      groups[shopId].items.push(item);
    });
    return groups;
  };

  // Kiểm tra xem shop có được chọn hoàn toàn hay không
  const isShopSelected = (shopId) => {
    const shopItems = groupItemsByShop()[shopId].items;
    return shopItems.every((item) => selectedItems.includes(item.cart_item_id));
  };

  // Kiểm tra xem shop có được chọn một phần hay không
  const isShopIndeterminate = (shopId) => {
    const shopItems = groupItemsByShop()[shopId].items;
    const selectedCount = shopItems.filter((item) =>
      selectedItems.includes(item.cart_item_id)
    ).length;
    return selectedCount > 0 && selectedCount < shopItems.length;
  };

  // Render giỏ hàng bình thường
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Giỏ hàng của bạn
              </h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedItems.length === items.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700">
                  Chọn tất cả ({selectedItems.length}/{items.length})
                </span>
              </label>
            </div>

            {Object.entries(groupItemsByShop()).map(
              ([shopId, { shop, items: shopItems }]) => (
                <div key={shopId} className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="checkbox"
                      checked={isShopSelected(shopId)}
                      onChange={(e) =>
                        handleSelectShop(e.target.checked, shopId)
                      }
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex items-center gap-2">
                      <img
                        src={shop.logo}
                        alt={shop.shop_name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="font-medium text-gray-800">
                        {shop.shop_name}
                      </span>
                    </div>
                  </div>

                  {shopItems.map((item) => (
                    <div
                      key={item.cart_item_id}
                      className="bg-gray-50 rounded-lg p-4 mb-4"
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-1">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.cart_item_id)}
                            onChange={(e) =>
                              handleSelectItem(
                                e.target.checked,
                                item.cart_item_id
                              )
                            }
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                        </div>
                        <div className="col-span-3">
                          <img
                            src={item.variant?.image_url}
                            alt={item.product.product_name}
                            className="w-full max-w-[100px] h-auto rounded"
                          />
                        </div>
                        <div className="col-span-8">
                          <h3 className="font-medium text-gray-800 mb-2">
                            {item.product.product_name}
                          </h3>

                          {item.variant && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {item.variant.attributes.size && (
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                  Size: {item.variant.attributes.size}
                                </span>
                              )}
                              {item.variant.attributes.color && (
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                  Màu: {item.variant.attributes.color}
                                </span>
                              )}
                              {item.variant.attributes.material && (
                                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                  Chất liệu: {item.variant.attributes.material}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-blue-600">
                              {formatPrice(item.price)}
                            </span>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.cart_item_id,
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={item.quantity <= 1}
                                  className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50"
                                >
                                  <MinusIcon className="w-4 h-4" />
                                </button>
                                <span className="w-8 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.cart_item_id,
                                      item.quantity + 1
                                    )
                                  }
                                  disabled={
                                    item.quantity >=
                                    (item.variant?.stock || 999)
                                  }
                                  className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50"
                                >
                                  <PlusIcon className="w-4 h-4" />
                                </button>
                              </div>
                              <button
                                onClick={() =>
                                  handleRemoveItem(item.cart_item_id)
                                }
                                className="text-red-500 hover:text-red-600"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Tổng đơn hàng
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-medium">
                  {formatPrice(calculateSubtotal())}
                </span>
              </div>

              {coupon && (
                <>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <TagIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-green-800">
                            Mã giảm giá đã áp dụng
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-2xl font-bold text-green-600">
                              -{formatPrice(calculateDiscount())}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                        title="Xóa mã giảm giá"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="mt-3 p-3 bg-white/70 rounded-lg border border-green-100">
                      <div className="text-sm text-green-700 font-medium">
                        Chi tiết:{" "}
                        {coupon.discount_type === "percentage"
                          ? `Giảm ${coupon.discount_value}%`
                          : `Giảm ${formatPrice(
                              parseFloat(coupon.discount_value)
                            )}`}
                        {coupon.max_discount &&
                          ` (Tối đa ${formatPrice(
                            parseFloat(coupon.max_discount)
                          )})`}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="border-t border-gray-100 my-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                </div>
              </div>

              {/* Tổng cộng với design đẹp hơn */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">
                    Tổng thanh toán:
                  </span>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {formatPrice(calculateTotal())}
                    </div>
                    <div className="text-sm text-blue-500 mt-1">
                      Đã bao gồm thuế VAT
                    </div>
                  </div>
                </div>
              </div>

              {/* Phần chọn mã giảm giá được redesign */}
              {!coupon && (
                <div className="mb-6 relative">
                  <button
                    onClick={() => {
                      setShowCouponList(!showCouponList);
                      if (!showCouponList) fetchAvailableCoupons();
                    }}
                    className="w-full bg-gradient-to-r from-white to-gray-50 border-2 border-dashed border-gray-300 
                     hover:border-blue-400 hover:from-blue-50 hover:to-indigo-50
                     text-gray-700 font-medium py-4 px-6 rounded-xl transition-all duration-300 
                     flex items-center justify-between group shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 group-hover:bg-blue-100 p-2 rounded-lg transition-colors duration-200">
                        <TagIcon className="w-6 h-6 text-gray-500 group-hover:text-blue-500" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-800">
                          Chọn mã giảm giá
                        </div>
                        <div className="text-sm text-gray-500">
                          Tiết kiệm thêm cho đơn hàng
                        </div>
                      </div>
                    </div>
                    <ChevronDownIcon
                      className={`w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-all duration-300 ${
                        showCouponList ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown danh sách mã giảm giá được redesign */}
                  {showCouponList && (
                    <div className="absolute z-20 mt-3 w-full bg-white border border-gray-200 rounded-2xl shadow-2xl backdrop-blur-sm animate-in slide-in-from-top-2 duration-200">
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              Mã giảm giá
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Chọn mã phù hợp với đơn hàng
                            </p>
                          </div>
                          <button
                            onClick={() => setShowCouponList(false)}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200"
                          >
                            <XIcon className="w-6 h-6" />
                          </button>
                        </div>

                        {loadingCoupons ? (
                          <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-500 mb-4"></div>
                            <div className="text-gray-500 font-medium">
                              Đang tải mã giảm giá...
                            </div>
                          </div>
                        ) : availableCoupons.length > 0 ? (
                          <div className="space-y-4 max-h-80 overflow-y-auto">
                            {availableCoupons.map((coupon) => (
                              <div
                                key={coupon.coupon_id}
                                className="group relative bg-gradient-to-r from-white to-gray-50 border border-gray-200 
                                             hover:border-blue-300 hover:from-blue-50 hover:to-indigo-50 
                                             rounded-xl p-4 cursor-pointer transition-all duration-300 
                                             hover:shadow-lg hover:-translate-y-1"
                                onClick={() => handleSelectCoupon(coupon.code)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <div className="bg-orange-100 group-hover:bg-orange-200 p-2 rounded-lg transition-colors duration-200">
                                        <TagIcon className="w-5 h-5 text-orange-500" />
                                      </div>
                                      <div className="font-bold text-lg text-gray-800 tracking-wider">
                                        {coupon.code}
                                      </div>
                                    </div>

                                    <div className="ml-11 space-y-1">
                                      <div className="text-lg font-semibold text-green-600">
                                        {coupon.discount_type === "percentage"
                                          ? `Giảm ${coupon.discount_value}%`
                                          : `Giảm ${formatPrice(
                                              parseFloat(coupon.discount_value)
                                            )}`}
                                        {coupon.max_discount && (
                                          <span className="text-sm text-gray-500 ml-2">
                                            (Tối đa{" "}
                                            {formatPrice(
                                              parseFloat(coupon.max_discount)
                                            )}
                                            )
                                          </span>
                                        )}
                                      </div>

                                      {coupon.min_order_amount && (
                                        <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                          <span className="text-sm text-gray-600">
                                            Đơn tối thiểu{" "}
                                            {formatPrice(
                                              coupon.min_order_amount
                                            )}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <button
                                    className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600
                                                     hover:from-blue-600 hover:to-indigo-700 rounded-lg shadow-md hover:shadow-lg
                                                     transition-all duration-200 transform hover:scale-105"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSelectCoupon(coupon.code);
                                    }}
                                  >
                                    Áp dụng
                                  </button>
                                </div>

                                {/* Hiệu ứng gradient border khi hover */}
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10"></div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                              <TagIcon className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="text-gray-500 font-medium text-lg">
                              Không có mã giảm giá
                            </div>
                            <div className="text-gray-400 text-sm mt-1">
                              Hiện tại chưa có mã giảm giá nào khả dụng
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleCheckout}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                Tiến hành thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
