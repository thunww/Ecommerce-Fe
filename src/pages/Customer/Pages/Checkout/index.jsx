import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchCart,
    applyCoupon,
    calculateShipping,
    checkout,
    setSelectedAddress,
    setPaymentMethod,
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
} from "antd";
import { FaTruck, FaCreditCard, FaWallet, FaMoneyBillWave } from "react-icons/fa";

const { Title, Text } = Typography;
const { Option } = Select;

const Checkout = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [selectedPayment, setSelectedPayment] = useState("cod");

    const {
        cart,
        shippingFee,
        discount,
        selectedAddress,
        paymentMethods,
        shippingMethods,
        estimatedDeliveryTime,
    } = useSelector((state) => state.cart);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleApplyCoupon = async () => {
        if (!couponCode) {
            message.warning("Vui lòng nhập mã giảm giá");
            return;
        }
        await dispatch(applyCoupon(couponCode));
    };

    const handleAddressChange = (values) => {
        dispatch(setSelectedAddress(values));
        dispatch(calculateShipping(values));
    };

    const handlePaymentChange = (value) => {
        setSelectedPayment(value);
        dispatch(setPaymentMethod(value));
    };

    const handleCheckout = async (values) => {
        try {
            setLoading(true);
            const orderData = {
                ...values,
                cart_id: cart.cart_id,
                payment_method: selectedPayment,
                shipping_address: selectedAddress,
                shipping_fee: shippingFee,
                discount: discount,
                coupon_code: couponCode,
            };
            await dispatch(checkout(orderData)).unwrap();
            message.success("Đặt hàng thành công!");
            // Redirect to order confirmation page
        } catch (error) {
            message.error(error.message || "Có lỗi xảy ra khi đặt hàng");
        } finally {
            setLoading(false);
        }
    };

    if (!cart) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    const totalPrice = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const finalPrice = totalPrice + shippingFee - discount;

    return (
        <div className="container mx-auto px-4 py-8">
            <Title level={2}>Thanh toán</Title>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Thông tin giao hàng */}
                <div className="lg:col-span-2">
                    <Card title="Thông tin giao hàng" className="mb-6">
                        <Form
                            form={form}
                            layout="vertical"
                            onValuesChange={handleAddressChange}
                        >
                            <Form.Item
                                name="fullName"
                                label="Họ và tên"
                                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="phone"
                                label="Số điện thoại"
                                rules={[
                                    { required: true, message: "Vui lòng nhập số điện thoại" },
                                    {
                                        pattern: /^[0-9]{10}$/,
                                        message: "Số điện thoại không hợp lệ",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: "Vui lòng nhập email" },
                                    { type: "email", message: "Email không hợp lệ" },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="address"
                                label="Địa chỉ"
                                rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                            >
                                <Input.TextArea rows={3} />
                            </Form.Item>
                            <Form.Item
                                name="city"
                                label="Thành phố"
                                rules={[{ required: true, message: "Vui lòng chọn thành phố" }]}
                            >
                                <Select>
                                    <Option value="hanoi">Hà Nội</Option>
                                    <Option value="hcm">TP. Hồ Chí Minh</Option>
                                    <Option value="danang">Đà Nẵng</Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Card>

                    {/* Phương thức thanh toán */}
                    <Card title="Phương thức thanh toán">
                        <Radio.Group
                            value={selectedPayment}
                            onChange={(e) => handlePaymentChange(e.target.value)}
                            className="w-full"
                        >
                            <Space direction="vertical" className="w-full">
                                <Radio value="cod" className="w-full py-2">
                                    <Space>
                                        <FaMoneyBillWave className="text-xl" />
                                        <span>Thanh toán khi nhận hàng (COD)</span>
                                    </Space>
                                </Radio>
                                <Radio value="credit_card" className="w-full py-2">
                                    <Space>
                                        <FaCreditCard className="text-xl" />
                                        <span>Thẻ tín dụng/Thẻ ghi nợ</span>
                                    </Space>
                                </Radio>
                                <Radio value="e_wallet" className="w-full py-2">
                                    <Space>
                                        <FaWallet className="text-xl" />
                                        <span>Ví điện tử</span>
                                    </Space>
                                </Radio>
                                <Radio value="bank_transfer" className="w-full py-2">
                                    <Space>
                                        <FaTruck className="text-xl" />
                                        <span>Chuyển khoản ngân hàng</span>
                                    </Space>
                                </Radio>
                            </Space>
                        </Radio.Group>
                    </Card>
                </div>

                {/* Tổng đơn hàng */}
                <div className="lg:col-span-1">
                    <Card title="Tổng đơn hàng">
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Text>Tạm tính:</Text>
                                <Text>{totalPrice.toLocaleString()}đ</Text>
                            </div>
                            <div className="flex justify-between">
                                <Text>Phí vận chuyển:</Text>
                                <Text>{shippingFee.toLocaleString()}đ</Text>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <Text>Giảm giá:</Text>
                                    <Text>-{discount.toLocaleString()}đ</Text>
                                </div>
                            )}
                            <Divider />
                            <div className="flex justify-between font-bold text-lg">
                                <Text>Tổng cộng:</Text>
                                <Text>{finalPrice.toLocaleString()}đ</Text>
                            </div>

                            <div className="flex gap-2">
                                <Input
                                    placeholder="Nhập mã giảm giá"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                />
                                <Button type="primary" onClick={handleApplyCoupon}>
                                    Áp dụng
                                </Button>
                            </div>

                            <Button
                                type="primary"
                                size="large"
                                block
                                loading={loading}
                                onClick={() => form.submit()}
                            >
                                Đặt hàng
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Checkout; 