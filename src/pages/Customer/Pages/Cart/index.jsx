import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, Button, Input, message, Space, Typography, Divider, Spin, Empty, Result } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import CartItem from "./CartItem";
import { fetchCart } from "../../../../redux/slices/cartSlice";
import store from "../../../../redux/store";
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

const Cart = () => {
    console.log("=== Rendering Cart Component ===");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Lấy dữ liệu từ Redux store
    const { cart: reduxCart, loading, error } = useSelector((state) => {
        console.log("Redux state in selector:", state);
        return state.cart;
    });
    console.log("Redux Cart Data:", reduxCart);
    console.log("Loading state:", loading);
    console.log("Error state:", error);

    // In toàn bộ Redux store để debug
    console.log("Entire Redux Store:", store.getState());

    // Sử dụng local state để đảm bảo luôn có dữ liệu hiển thị
    const [cart, setCart] = useState(mockCartData);
    const [couponCode, setCouponCode] = useState("");
    const [debugInfo, setDebugInfo] = useState("");

    useEffect(() => {
        console.log("Cart component mounted, fetching cart data...");
        // Cố gắng lấy dữ liệu từ API
        dispatch(fetchCart())
            .unwrap()
            .then(data => {
                console.log("Dữ liệu giỏ hàng từ API:", data);
                if (data && data.items && data.items.length > 0) {
                    setCart(data);
                }
            })
            .catch(err => {
                console.error("Lỗi khi tải giỏ hàng:", err);
                setDebugInfo(JSON.stringify(err, null, 2));
            });
    }, [dispatch]);

    // Cập nhật cart từ Redux nếu có dữ liệu
    useEffect(() => {
        if (reduxCart && reduxCart.items && reduxCart.items.length > 0) {
            console.log("Cập nhật giỏ hàng từ Redux:", reduxCart);
            setCart(reduxCart);
        }
    }, [reduxCart]);

    const calculateTotal = () => {
        if (!cart?.items || !cart.items.length) return 0;
        return cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleApplyCoupon = () => {
        if (!couponCode.trim()) {
            message.warning("Vui lòng nhập mã giảm giá");
            return;
        }
        message.info("Đang áp dụng mã giảm giá: " + couponCode);
    };

    const handleCheckout = () => {
        message.success("Đang chuyển đến trang thanh toán...");
        navigate("/checkout");
    };

    console.log("Cart about to render with data:", cart);

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
    if (loading && !cart.items.length) {
        return (
            <div className="cart-container">
                <div className="loading-container">
                    <Spin size="large" />
                    <p>Đang tải giỏ hàng...</p>
                </div>
            </div>
        );
    }

    // Nếu có lỗi nhưng vẫn có dữ liệu mẫu, vẫn hiển thị cart với dữ liệu mẫu
    if (error && debugInfo) {
        return (
            <div className="cart-container">
                <Result
                    status="warning"
                    title="Không thể tải giỏ hàng từ máy chủ"
                    subTitle="Đang hiển thị dữ liệu mẫu, một số tính năng có thể không hoạt động."
                    extra={[
                        <Button key="retry" type="primary" onClick={() => dispatch(fetchCart())}>
                            Thử lại
                        </Button>
                    ]}
                />

                {/* Hiển thị debug info nếu cần */}
                <div className="debug-info">
                    <Text type="secondary">Debug info:</Text>
                    <pre>{debugInfo}</pre>
                </div>

                {/* Vẫn hiển thị giỏ hàng với dữ liệu mẫu */}
                <Title level={2}>Giỏ hàng của bạn</Title>
                <div className="cart-content">
                    <div className="cart-items">
                        {cart.items.map((item) => (
                            <CartItem key={item.cart_item_id || item.id} item={item} />
                        ))}
                    </div>

                    <div className="cart-summary">
                        <Card title="Tổng đơn hàng">
                            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                                <div className="summary-item">
                                    <Text>Tạm tính:</Text>
                                    <Text>{calculateTotal().toLocaleString("vi-VN")}đ</Text>
                                </div>

                                {cart.shippingFee > 0 && (
                                    <div className="summary-item">
                                        <Text>Phí vận chuyển:</Text>
                                        <Text>{cart.shippingFee.toLocaleString("vi-VN")}đ</Text>
                                    </div>
                                )}

                                {cart.discount > 0 && (
                                    <div className="summary-item">
                                        <Text>Giảm giá:</Text>
                                        <Text>-{cart.discount.toLocaleString("vi-VN")}đ</Text>
                                    </div>
                                )}

                                <div className="coupon-section">
                                    <Input
                                        placeholder="Nhập mã giảm giá"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        id="coupon-code"
                                        name="coupon-code"
                                        suffix={
                                            <Button type="link" onClick={handleApplyCoupon} aria-label="Áp dụng mã giảm giá">
                                                Áp dụng
                                            </Button>
                                        }
                                    />
                                </div>

                                <Divider />

                                <div className="summary-item total">
                                    <Text strong>Tổng cộng:</Text>
                                    <Text strong>{(calculateTotal() + (cart.shippingFee || 0) - (cart.discount || 0)).toLocaleString("vi-VN")}đ</Text>
                                </div>

                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    onClick={handleCheckout}
                                    aria-label="Tiến hành đặt hàng"
                                >
                                    Tiến hành đặt hàng
                                </Button>
                            </Space>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    // Hiển thị giỏ hàng trống nếu không có sản phẩm nào
    if (!cart?.items || cart.items.length === 0) {
        return (
            <div className="cart-container">
                <div className="empty-cart">
                    <Empty
                        image={<ShoppingCartOutlined style={{ fontSize: 64 }} />}
                        description="Giỏ hàng của bạn đang trống"
                    >
                        <Button type="primary" onClick={() => navigate("/products")}>
                            Tiếp tục mua sắm
                        </Button>
                    </Empty>
                </div>
            </div>
        );
    }

    // Render giỏ hàng bình thường
    return (
        <div className="cart-container">
            <Title level={2}>Giỏ hàng của bạn</Title>

            <div className="cart-content">
                <div className="cart-items">
                    {cart.items.map((item) => (
                        <CartItem
                            key={item.cart_item_id || item.id}
                            item={item}
                        />
                    ))}
                </div>

                <div className="cart-summary">
                    <Card title="Tổng đơn hàng">
                        <Space direction="vertical" size="large" style={{ width: "100%" }}>
                            <div className="summary-item">
                                <Text>Tạm tính:</Text>
                                <Text>{calculateTotal().toLocaleString("vi-VN")}đ</Text>
                            </div>

                            {cart.shippingFee > 0 && (
                                <div className="summary-item">
                                    <Text>Phí vận chuyển:</Text>
                                    <Text>{cart.shippingFee.toLocaleString("vi-VN")}đ</Text>
                                </div>
                            )}

                            {cart.discount > 0 && (
                                <div className="summary-item">
                                    <Text>Giảm giá:</Text>
                                    <Text>-{cart.discount.toLocaleString("vi-VN")}đ</Text>
                                </div>
                            )}

                            <div className="coupon-section">
                                <Input
                                    placeholder="Nhập mã giảm giá"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    id="coupon-code"
                                    name="coupon-code"
                                    suffix={
                                        <Button type="link" onClick={handleApplyCoupon} aria-label="Áp dụng mã giảm giá">
                                            Áp dụng
                                        </Button>
                                    }
                                />
                            </div>

                            <Divider />

                            <div className="summary-item total">
                                <Text strong>Tổng cộng:</Text>
                                <Text strong>{(calculateTotal() + (cart.shippingFee || 0) - (cart.discount || 0)).toLocaleString("vi-VN")}đ</Text>
                            </div>

                            <Button
                                type="primary"
                                size="large"
                                block
                                onClick={handleCheckout}
                                aria-label="Tiến hành đặt hàng"
                            >
                                Tiến hành đặt hàng
                            </Button>
                        </Space>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Cart; 