import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, Button, Input, message, Space, Typography, Divider, Spin, Empty, Result, Row, Col, Tag, Checkbox } from "antd";
import { ShoppingCartOutlined, ShoppingOutlined, DeleteOutlined, PlusOutlined, MinusOutlined, TagOutlined } from "@ant-design/icons";
import CartItem from "./CartItem";
import { fetchCart, updateCartItem, removeFromCart, applyCoupon } from "../../../../redux/slices/cartSlice";
import "./Cart.css";

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
    const { items = [], loading, error } = useSelector((state) => state.cart);
    const [couponCode, setCouponCode] = useState("");
    const [applyingCoupon, setApplyingCoupon] = useState(false);

    // State cho các item được chọn
    const [selectedItems, setSelectedItems] = useState([]);
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

    // Xử lý chọn tất cả items
    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedItems(items.map(item => item.cart_item_id));
        } else {
            setSelectedItems([]);
        }
    };

    // Xử lý chọn từng item
    const handleSelectItem = (checked, cartItemId) => {
        if (checked) {
            setSelectedItems(prev => [...prev, cartItemId]);
        } else {
            setSelectedItems(prev => prev.filter(id => id !== cartItemId));
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
            await dispatch(updateCartItem({ cartItemId, quantity: newQuantity })).unwrap();
            message.success("Cập nhật số lượng thành công");
        } catch (error) {
            message.error(error.message || "Có lỗi xảy ra khi cập nhật số lượng");
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        try {
            await dispatch(removeFromCart(cartItemId)).unwrap();
            setSelectedItems(prev => prev.filter(id => id !== cartItemId));
            setSelectedVariants(prev => {
                const newVariants = { ...prev };
                delete newVariants[cartItemId];
                return newVariants;
            });
            message.success("Đã xóa sản phẩm khỏi giỏ hàng");
        } catch (error) {
            message.error("Không thể xóa sản phẩm");
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            message.warning("Vui lòng nhập mã giảm giá");
            return;
        }

        setApplyingCoupon(true);
        try {
            await dispatch(applyCoupon(couponCode)).unwrap();
            message.success("Áp dụng mã giảm giá thành công");
            setCouponCode("");
        } catch (error) {
            message.error(error.message || "Có lỗi xảy ra khi áp dụng mã giảm giá");
        } finally {
            setApplyingCoupon(false);
        }
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            message.warning("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
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
            <div className="cart-loading">
                <Spin size="large" />
                <Text>Đang tải giỏ hàng...</Text>
            </div>
        );
    }

    // Nếu có lỗi nhưng vẫn có dữ liệu mẫu, vẫn hiển thị cart với dữ liệu mẫu
    if (error) {
        return (
            <div className="cart-error">
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <Text type="danger">{error}</Text>
                    }
                />
            </div>
        );
    }

    // Hiển thị giỏ hàng trống nếu không có sản phẩm nào
    if (!items || items.length === 0) {
        return (
            <div className="cart-empty">
                <Empty
                    image={<ShoppingCartOutlined style={{ fontSize: 64 }} />}
                    description={
                        <Text>Giỏ hàng của bạn đang trống</Text>
                    }
                >
                    <Button
                        type="primary"
                        onClick={handleContinueShopping}
                        size="large"
                    >
                        Tiếp tục mua sắm
                    </Button>
                </Empty>
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
        return items.reduce((total, item) => total + parseFloat(item.total_price), 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const shippingFee = 0; // Tạm thời để 0
        const discount = 0; // Tạm thời để 0
        return subtotal + shippingFee - discount;
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

    // Xử lý chọn tất cả sản phẩm của một shop
    const handleSelectShop = (checked, shopId) => {
        const shopItems = groupItemsByShop()[shopId].items;
        const shopItemIds = shopItems.map(item => item.cart_item_id);

        if (checked) {
            setSelectedItems(prev => [...new Set([...prev, ...shopItemIds])]);
        } else {
            setSelectedItems(prev => prev.filter(id => !shopItemIds.includes(id)));
        }
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
        <div className="cart-container">
            <Title level={2}>Giỏ hàng của bạn</Title>
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card className="cart-items">
                        <div className="cart-header">
                            <h1>Giỏ hàng của bạn</h1>
                            <Checkbox
                                checked={selectedItems.length === items.length}
                                indeterminate={selectedItems.length > 0 && selectedItems.length < items.length}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                            >
                                Chọn tất cả ({selectedItems.length}/{items.length})
                            </Checkbox>
                        </div>

                        {Object.entries(groupItemsByShop()).map(([shopId, { shop, items: shopItems }]) => (
                            <div key={shopId} className="shop-items-group">
                                <div className="shop-header">
                                    <Checkbox
                                        checked={isShopSelected(shopId)}
                                        indeterminate={isShopIndeterminate(shopId)}
                                        onChange={(e) => handleSelectShop(e.target.checked, shopId)}
                                    />
                                    <div className="shop-info">
                                        <img
                                            src={shop.logo}
                                            alt={shop.shop_name}
                                            className="shop-logo"
                                        />
                                        <Text strong>{shop.shop_name}</Text>
                                    </div>
                                </div>

                                {shopItems.map((item) => (
                                    <div key={item.cart_item_id} className="cart-item">
                                        <Row gutter={[16, 16]} align="middle">
                                            <Col flex="32px">
                                                <Checkbox
                                                    checked={selectedItems.includes(item.cart_item_id)}
                                                    onChange={(e) => handleSelectItem(e.target.checked, item.cart_item_id)}
                                                />
                                            </Col>
                                            <Col xs={24} sm={8} md={6}>
                                                <div className="product-image">
                                                    <img
                                                        src={item.variant?.image_url}
                                                        alt={item.product.product_name}
                                                    />
                                                </div>
                                            </Col>
                                            <Col xs={24} sm={16} md={16}>
                                                <div className="product-info">
                                                    <Title level={5}>{item.product.product_name}</Title>

                                                    {item.variant && (
                                                        <div className="variant-info">
                                                            <Space wrap>
                                                                {item.variant.attributes.size && (
                                                                    <Tag color="blue">Size: {item.variant.attributes.size}</Tag>
                                                                )}
                                                                {item.variant.attributes.color && (
                                                                    <Tag color="green">Màu: {item.variant.attributes.color}</Tag>
                                                                )}
                                                                {item.variant.attributes.material && (
                                                                    <Tag color="purple">Chất liệu: {item.variant.attributes.material}</Tag>
                                                                )}
                                                            </Space>
                                                        </div>
                                                    )}

                                                    <div className="price-info">
                                                        <Text className="price">{formatPrice(item.price)}</Text>
                                                    </div>

                                                    <div className="item-actions">
                                                        <Space>
                                                            <Button
                                                                icon={<MinusOutlined />}
                                                                onClick={() => handleQuantityChange(item.cart_item_id, item.quantity - 1)}
                                                                disabled={item.quantity <= 1}
                                                            />
                                                            <Text>{item.quantity}</Text>
                                                            <Button
                                                                icon={<PlusOutlined />}
                                                                onClick={() => handleQuantityChange(item.cart_item_id, item.quantity + 1)}
                                                                disabled={item.quantity >= (item.variant?.stock || 999)}
                                                            />
                                                            <Button
                                                                type="text"
                                                                danger
                                                                icon={<DeleteOutlined />}
                                                                onClick={() => handleRemoveItem(item.cart_item_id)}
                                                            />
                                                        </Space>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                ))}
                                <Divider />
                            </div>
                        ))}
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card className="cart-summary">
                        <Title level={4}>Tổng đơn hàng</Title>
                        <div className="summary-item">
                            <Text>Tạm tính:</Text>
                            <Text>{formatPrice(calculateSubtotal())}</Text>
                        </div>
                        <div className="summary-item">
                            <Text>Phí vận chuyển:</Text>
                            <Text>{formatPrice(0)}</Text>
                        </div>
                        <div className="summary-item">
                            <Text>Giảm giá:</Text>
                            <Text type="success">-{formatPrice(0)}</Text>
                        </div>
                        <Divider />
                        <div className="summary-item total">
                            <Text strong>Tổng cộng:</Text>
                            <Text strong>{formatPrice(calculateTotal())}</Text>
                        </div>

                        <div className="coupon-section">
                            <Input
                                placeholder="Nhập mã giảm giá"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                prefix={<TagOutlined />}
                                suffix={
                                    <Button
                                        type="primary"
                                        loading={applyingCoupon}
                                        onClick={handleApplyCoupon}
                                    >
                                        Áp dụng
                                    </Button>
                                }
                            />
                        </div>

                        <Button
                            type="primary"
                            size="large"
                            block
                            className="checkout-button"
                            onClick={handleCheckout}
                        >
                            Tiến hành thanh toán
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CartPage; 