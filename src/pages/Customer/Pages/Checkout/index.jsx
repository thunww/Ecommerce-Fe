import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    fetchCart,
    applyCoupon,
    calculateShipping,
    setSelectedAddress,
    setPaymentMethod,
    clearCart
} from "../../../../redux/slices/cartSlice";
import {
    Form,
    Input,
    Button,
    Select,
    Radio,
    Space,
    Divider,
    Card,
    Typography,
    message,
    Spin,
    Steps,
    Row,
    Col
} from "antd";
import { FaTruck, FaCreditCard, FaWallet, FaMoneyBillWave, FaMapMarkerAlt } from "react-icons/fa";
import './Checkout.css';

const { Title, Text } = Typography;
const { Option } = Select;

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState("cod");

    const {
        cart,
        shippingFee,
        discount,
        total,
        items
    } = useSelector((state) => state.cart);

    useEffect(() => {
        // Chỉ fetch cart nếu chưa có dữ liệu
        if (!items || items.length === 0) {
            dispatch(fetchCart());
        }
    }, [dispatch]);

    // Kiểm tra giỏ hàng trống và chuyển hướng
    useEffect(() => {
        if (items && items.length === 0) {
            navigate('/cart');
        }
    }, [items, navigate]);

    const handlePaymentChange = (e) => {
        setSelectedPayment(e.target.value);
        dispatch(setPaymentMethod(e.target.value));
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const orderData = {
                shipping_address: {
                    full_name: values.full_name,
                    phone: values.phone,
                    address: values.address,
                    city: values.city,
                    district: values.district,
                    ward: values.ward
                },
                payment_method: selectedPayment,
                items: items.map(item => ({
                    product_id: item.product_id,
                    variant_id: item.variant_id,
                    quantity: item.quantity
                }))
            };

            // Gửi request tạo đơn hàng đến API
            const response = await fetch('http://localhost:3000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                message.success('Đặt hàng thành công!');
                dispatch(clearCart());
                navigate('/my-account/orders');
            } else {
                throw new Error('Đặt hàng thất bại');
            }
        } catch (error) {
            message.error(error.message || 'Đặt hàng thất bại. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    if (!cart || loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <div className="checkout-header">
                <Title level={3}>Thanh toán</Title>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="checkout-form"
            >
                <Row gutter={24}>
                    <Col span={16}>
                        <Card className="shipping-info-card">
                            <div className="section-title">
                                <FaMapMarkerAlt />
                                <Title level={4}>Địa chỉ nhận hàng</Title>
                            </div>
                            <Form.Item
                                name="full_name"
                                label="Họ và tên"
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                            >
                                <Input placeholder="Nhập họ và tên người nhận" />
                            </Form.Item>

                            <Form.Item
                                name="phone"
                                label="Số điện thoại"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item
                                        name="city"
                                        label="Tỉnh/Thành phố"
                                        rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố' }]}
                                    >
                                        <Select placeholder="Chọn tỉnh/thành phố">
                                            <Option value="hanoi">Hà Nội</Option>
                                            <Option value="hcm">TP. Hồ Chí Minh</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="district"
                                        label="Quận/Huyện"
                                        rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
                                    >
                                        <Select placeholder="Chọn quận/huyện">
                                            <Option value="thanhxuan">Thanh Xuân</Option>
                                            <Option value="hoankiem">Hoàn Kiếm</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="ward"
                                        label="Phường/Xã"
                                        rules={[{ required: true, message: 'Vui lòng chọn phường/xã' }]}
                                    >
                                        <Select placeholder="Chọn phường/xã">
                                            <Option value="phuong1">Phường 1</Option>
                                            <Option value="phuong2">Phường 2</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="address"
                                label="Địa chỉ cụ thể"
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ cụ thể' }]}
                            >
                                <Input.TextArea placeholder="Số nhà, tên đường..." />
                            </Form.Item>
                        </Card>

                        <Card className="payment-method-card">
                            <div className="section-title">
                                <FaCreditCard />
                                <Title level={4}>Phương thức thanh toán</Title>
                            </div>
                            <Form.Item
                                name="payment_method"
                                initialValue="cod"
                            >
                                <Radio.Group onChange={handlePaymentChange} value={selectedPayment}>
                                    <Space direction="vertical">
                                        <Radio value="cod">
                                            <Space>
                                                <FaMoneyBillWave />
                                                Thanh toán khi nhận hàng (COD)
                                            </Space>
                                        </Radio>
                                        <Radio value="momo">
                                            <Space>
                                                <FaWallet />
                                                Ví MoMo
                                            </Space>
                                        </Radio>
                                        <Radio value="vnpay">
                                            <Space>
                                                <FaCreditCard />
                                                VNPay
                                            </Space>
                                        </Radio>
                                    </Space>
                                </Radio.Group>
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col span={8}>
                        <Card className="order-summary-card">
                            <Title level={4}>Tóm tắt đơn hàng</Title>
                            <div className="order-items">
                                {items.map(item => (
                                    <div key={item.cart_item_id} className="order-item">
                                        <div className="item-info">
                                            <img src={item.image} alt={item.product_name} />
                                            <div>
                                                <Text>{item.product_name}</Text>
                                                <Text type="secondary">x{item.quantity}</Text>
                                            </div>
                                        </div>
                                        <Text strong>{item.total_price.toLocaleString('vi-VN')}đ</Text>
                                    </div>
                                ))}
                            </div>

                            <Divider />

                            <div className="price-summary">
                                <div className="price-row">
                                    <Text>Tạm tính</Text>
                                    <Text>{total.toLocaleString('vi-VN')}đ</Text>
                                </div>
                                <div className="price-row">
                                    <Text>Phí vận chuyển</Text>
                                    <Text>{shippingFee.toLocaleString('vi-VN')}đ</Text>
                                </div>
                                {discount > 0 && (
                                    <div className="price-row discount">
                                        <Text>Giảm giá</Text>
                                        <Text>-{discount.toLocaleString('vi-VN')}đ</Text>
                                    </div>
                                )}
                                <Divider />
                                <div className="price-row total">
                                    <Text strong>Tổng cộng</Text>
                                    <Text strong className="total-amount">
                                        {(total + shippingFee - discount).toLocaleString('vi-VN')}đ
                                    </Text>
                                </div>
                            </div>

                            <Button
                                type="primary"
                                size="large"
                                block
                                htmlType="submit"
                                loading={loading}
                                className="checkout-button"
                            >
                                Đặt hàng
                            </Button>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default Checkout; 