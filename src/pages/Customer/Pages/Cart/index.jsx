import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
    FormControlLabel
} from '@mui/material';
import {
    ShoppingCart as ShoppingCartIcon,
    LocalShipping as ShippingIcon,
    Tag as TagIcon,
    Delete as DeleteIcon,
    SentimentDissatisfied as EmptyIcon,
    Add as AddIcon,
    Remove as RemoveIcon
} from '@mui/icons-material';
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
    clearCoupon
} from "../../../../redux/slices/cartSlice";
import "./Cart.css";
import {
    ShoppingCartIcon as HeroShoppingCartIcon,
    TrashIcon,
    PlusIcon,
    MinusIcon,
    FaceFrownIcon
} from '@heroicons/react/24/outline';

const { Title, Text } = Typography;

// Dữ liệu giả để kiểm tra hiển thị
const mockCartData = {
    items: [
        {
            id: 1,
            cart_item_id: 1,
            name: "Sản phẩm mẫu 1",
            product_name: "Sản phẩm mẫu 1",
            product_image: "https://placehold.co/600x400?text=SP1",
            variant_name: "Xanh / M",
            price: 150000,
            original_price: 200000,
            quantity: 2,
            stock: 10
        },
        {
            id: 2,
            cart_item_id: 2,
            name: "Sản phẩm mẫu 2",
            product_name: "Sản phẩm mẫu 2",
            product_image: "https://placehold.co/600x400?text=SP2",
            variant_name: "Đỏ / L",
            price: 250000,
            quantity: 1,
            stock: 5
        }
    ],
    shippingFee: 30000,
    discount: 50000
};

const CartPage = () => {
    console.log("=== Rendering Cart Component ===");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Lấy dữ liệu từ Redux store
    const { items = [], loading, error, selectedItems = [], coupon, discount, couponError } = useSelector((state) => state.cart);
    const [couponCode, setCouponCode] = useState("");
    const [applyingCoupon, setApplyingCoupon] = useState(false);

    // State cho biến thể được chọn
    const [selectedVariants, setSelectedVariants] = useState({});

    useEffect(() => {
        console.log("Fetching cart data...");
        dispatch(fetchCart())
            .unwrap()
            .then(data => {
                console.log("Cart data received:", data);
            })
            .catch(err => {
                console.error("Error fetching cart:", err);
            });
    }, [dispatch]);

    const handleSelectAll = (checked) => {
        if (checked) {
            const allItemIds = items.map(item => item.cart_item_id);
            allItemIds.forEach(id => dispatch(toggleSelectItem({ cart_item_id: id })));
        } else {
            dispatch(clearSelectedItems());
        }
    };

    const handleSelectItem = (checked, cartItemId) => {
        dispatch(toggleSelectItem({ cart_item_id: cartItemId }));
    };

    const handleSelectShop = (checked, shopId) => {
        const shopItems = groupItemsByShop()[shopId].items;
        const shopItemIds = shopItems.map(item => item.cart_item_id);

        if (checked) {
            shopItemIds.forEach(id => dispatch(toggleSelectItem({ cart_item_id: id })));
        } else {
            shopItemIds.forEach(id => {
                if (selectedItems.includes(id)) {
                    dispatch(toggleSelectItem({ cart_item_id: id }));
                }
            });
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        try {
            await dispatch(removeFromCart(cartItemId)).unwrap();
            setSelectedVariants(prev => {
                const newVariants = { ...prev };
                delete newVariants[cartItemId];
                return newVariants;
            });
            console.log("Đã xóa sản phẩm khỏi giỏ hàng");
        } catch (error) {
            console.error("Không thể xóa sản phẩm");
        }
    };

    // Xử lý thay đổi biến thể
    const handleVariantChange = (cartItemId, variantId) => {
        setSelectedVariants(prev => ({
            ...prev,
            [cartItemId]: variantId
        }));
    };

    const handleQuantityChange = async (cartItemId, newQuantity) => {
        try {
            await dispatch(updateCartItem({ cart_item_id: cartItemId, quantity: newQuantity })).unwrap();
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
            // Validate mã giảm giá
            const validationResult = await dispatch(validateCoupon(couponCode)).unwrap();

            if (validationResult.isValid) {
                // Áp dụng mã giảm giá vào giỏ hàng ngay sau khi validate thành công
                const applyResult = await dispatch(applyCoupon({
                    code: couponCode,
                    cart_id: items[0]?.cart_id
                })).unwrap();

                console.log("Coupon applied successfully:", applyResult);
                setCouponCode("");

                // Cập nhật lại giỏ hàng để hiển thị số tiền đã giảm
                await dispatch(fetchCart());
            } else {
                console.error(validationResult.message || "Mã giảm giá không hợp lệ");
            }
        } catch (error) {
            console.error("Coupon error:", error);
            console.error(error.message || "Có lỗi xảy ra khi áp dụng mã giảm giá");
        } finally {
            setApplyingCoupon(false);
        }
    };

    const handleRemoveCoupon = async () => {
        try {
            // Kiểm tra xem có cart_id không
            if (!items || items.length === 0) {
                console.error("Không tìm thấy giỏ hàng");
                return;
            }

            const cartId = items[0]?.cart_id;
            if (!cartId) {
                console.error("Không tìm thấy cart_id");
                return;
            }

            // Gọi API xóa mã giảm giá với cart_id
            await dispatch(removeCoupon(cartId)).unwrap();

            // Xóa mã giảm giá khỏi state
            dispatch(clearCoupon());

            // Reset input để có thể nhập mã mới
            setCouponCode("");

            // Cập nhật lại giỏ hàng
            await dispatch(fetchCart());
        } catch (error) {
            console.error("Lỗi khi xóa mã giảm giá:", error);
            console.error(error.message || "Có lỗi xảy ra khi xóa mã giảm giá");
        }
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            console.warn("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
            return;
        }

        // Chuẩn bị dữ liệu cho trang checkout
        const checkoutData = {
            items: items.filter(item => selectedItems.includes(item.cart_item_id)),
            variants: selectedVariants,
            total: calculateTotal(),
            couponCode
        };

        // Lưu dữ liệu vào sessionStorage để sử dụng ở trang checkout
        sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));

        // Chuyển đến trang checkout
        navigate("/checkout");
    };

    const handleContinueShopping = () => {
        navigate("/products");
    };

    console.log("Current cart items:", items);

    // HardCoded JSX để kiểm tra hiển thị
    const renderHardCodedCart = () => (
        <div className="cart-container" style={{ padding: '30px', background: '#f0f0f0' }}>
            <h2>Giỏ hàng của bạn (Hard Coded)</h2>
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
                <p>Sản phẩm 1 - 150.000đ</p>
                <p>Sản phẩm 2 - 250.000đ</p>
                <hr />
                <p><strong>Tổng cộng: 400.000đ</strong></p>
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
                <p className="mt-4 text-lg font-medium text-gray-700">Đang tải giỏ hàng...</p>
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
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng của bạn đang trống</h2>
                <p className="text-gray-600 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
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
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const calculateSubtotal = () => {
        // Chỉ tính tổng giá của các sản phẩm được chọn
        return items
            .filter(item => selectedItems.includes(item.cart_item_id))
            .reduce((total, item) => total + parseFloat(item.total_price), 0);
    };

    const calculateDiscount = () => {
        if (!coupon) return 0;

        const subtotal = calculateSubtotal();
        let discountAmount = 0;

        const discountValue = parseFloat(coupon.discount_value);
        const maxDiscount = coupon.max_discount ? parseFloat(coupon.max_discount) : null;

        if (coupon.discount_type === 'percentage') {
            discountAmount = (subtotal * discountValue) / 100;
        } else if (coupon.discount_type === 'fixed') {
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
        items.forEach(item => {
            const shopId = item.product.shop.shop_id;
            if (!groups[shopId]) {
                groups[shopId] = {
                    shop: item.product.shop,
                    items: []
                };
            }
            groups[shopId].items.push(item);
        });
        return groups;
    };

    // Kiểm tra xem shop có được chọn hoàn toàn hay không
    const isShopSelected = (shopId) => {
        const shopItems = groupItemsByShop()[shopId].items;
        return shopItems.every(item => selectedItems.includes(item.cart_item_id));
    };

    // Kiểm tra xem shop có được chọn một phần hay không
    const isShopIndeterminate = (shopId) => {
        const shopItems = groupItemsByShop()[shopId].items;
        const selectedCount = shopItems.filter(item => selectedItems.includes(item.cart_item_id)).length;
        return selectedCount > 0 && selectedCount < shopItems.length;
    };

    // Render giỏ hàng bình thường
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Giỏ hàng của bạn</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Giỏ hàng của bạn</h2>
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

                        {Object.entries(groupItemsByShop()).map(([shopId, { shop, items: shopItems }]) => (
                            <div key={shopId} className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <input
                                        type="checkbox"
                                        checked={isShopSelected(shopId)}
                                        onChange={(e) => handleSelectShop(e.target.checked, shopId)}
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={shop.logo}
                                            alt={shop.shop_name}
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <span className="font-medium text-gray-800">{shop.shop_name}</span>
                                    </div>
                                </div>

                                {shopItems.map((item) => (
                                    <div key={item.cart_item_id} className="bg-gray-50 rounded-lg p-4 mb-4">
                                        <div className="grid grid-cols-12 gap-4 items-center">
                                            <div className="col-span-1">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.includes(item.cart_item_id)}
                                                    onChange={(e) => handleSelectItem(e.target.checked, item.cart_item_id)}
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
                                                <h3 className="font-medium text-gray-800 mb-2">{item.product.product_name}</h3>

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
                                                                onClick={() => handleQuantityChange(item.cart_item_id, item.quantity - 1)}
                                                                disabled={item.quantity <= 1}
                                                                className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50"
                                                            >
                                                                <MinusIcon className="w-4 h-4" />
                                                            </button>
                                                            <span className="w-8 text-center">{item.quantity}</span>
                                                            <button
                                                                onClick={() => handleQuantityChange(item.cart_item_id, item.quantity + 1)}
                                                                disabled={item.quantity >= (item.variant?.stock || 999)}
                                                                className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50"
                                                            >
                                                                <PlusIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveItem(item.cart_item_id)}
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
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Tổng đơn hàng</h2>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tạm tính:</span>
                                <span className="font-medium">{formatPrice(calculateSubtotal())}</span>
                            </div>

                            {coupon && (
                                <>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Mã giảm giá:</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-green-600 font-medium">
                                                -{formatPrice(calculateDiscount())}
                                            </span>
                                            <button
                                                onClick={handleRemoveCoupon}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Chi tiết mã: {coupon.discount_type === 'percentage'
                                            ? `Giảm ${coupon.discount_value}%`
                                            : `Giảm ${formatPrice(parseFloat(coupon.discount_value))}`}
                                        {coupon.max_discount && ` (Tối đa ${formatPrice(parseFloat(coupon.max_discount))})`}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="border-t border-gray-200 my-6"></div>

                        <div className="flex justify-between items-center mb-6">
                            <span className="text-lg font-semibold">Tổng cộng:</span>
                            <span className="text-xl font-bold text-blue-600">
                                {formatPrice(calculateTotal())}
                            </span>
                        </div>

                        {!coupon && (
                            <div className="mb-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Nhập mã giảm giá"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <TagIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                                    <button
                                        onClick={handleApplyCoupon}
                                        disabled={applyingCoupon}
                                        className="absolute right-2 top-1.5 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md transition-colors disabled:opacity-50"
                                    >
                                        {applyingCoupon ? 'Đang áp dụng...' : 'Áp dụng'}
                                    </button>
                                </div>
                                {couponError && (
                                    <p className="mt-2 text-sm text-red-600">{couponError}</p>
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
    );
};

export default CartPage; 