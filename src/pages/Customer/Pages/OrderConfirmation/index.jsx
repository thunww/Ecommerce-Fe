import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
    Card,
    Typography,
    Button,
    Space,
    Steps,
    Divider,
    List,
    Tag,
    Spin,
    message,
} from "antd";
import {
    CheckCircleOutlined,
    LoadingOutlined,
    ClockCircleOutlined,
    CarOutlined,
    CheckOutlined,
} from "@ant-design/icons";
import { getOrderStatus, trackOrder } from "../../../../redux/slices/cartSlice";

const { Title, Text } = Typography;
const { Step } = Steps;

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { orderStatus, trackingInfo, loading } = useSelector(
        (state) => state.cart
    );

    useEffect(() => {
        if (orderId) {
            dispatch(getOrderStatus(orderId));
            dispatch(trackOrder(orderId));
        }
    }, [dispatch, orderId]);

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "warning";
            case "processing":
                return "processing";
            case "shipped":
                return "blue";
            case "delivered":
                return "success";
            case "cancelled":
                return "error";
            default:
                return "default";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "pending":
                return <ClockCircleOutlined />;
            case "processing":
                return <LoadingOutlined />;
            case "shipped":
                return <CarOutlined />;
            case "delivered":
                return <CheckOutlined />;
            case "cancelled":
                return <CheckCircleOutlined />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    if (!orderStatus) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <Title level={2}>Không tìm thấy đơn hàng</Title>
                <Button type="primary" onClick={() => navigate("/")}>
                    Quay lại trang chủ
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <Card>
                    <div className="text-center mb-8">
                        <CheckCircleOutlined className="text-6xl text-green-500 mb-4" />
                        <Title level={2}>Đặt hàng thành công!</Title>
                        <Text type="secondary">
                            Cảm ơn bạn đã mua hàng. Chúng tôi sẽ gửi email xác nhận đơn hàng
                            cho bạn.
                        </Text>
                    </div>

                    <Divider />

                    <div className="mb-8">
                        <Title level={4}>Thông tin đơn hàng</Title>
                        <List>
                            <List.Item>
                                <Text strong>Mã đơn hàng:</Text>
                                <Text className="ml-2">{orderStatus.order_id}</Text>
                            </List.Item>
                            <List.Item>
                                <Text strong>Ngày đặt hàng:</Text>
                                <Text className="ml-2">
                                    {new Date(orderStatus.created_at).toLocaleString()}
                                </Text>
                            </List.Item>
                            <List.Item>
                                <Text strong>Trạng thái:</Text>
                                <Tag
                                    color={getStatusColor(orderStatus.status)}
                                    icon={getStatusIcon(orderStatus.status)}
                                    className="ml-2"
                                >
                                    {orderStatus.status}
                                </Tag>
                            </List.Item>
                            <List.Item>
                                <Text strong>Tổng tiền:</Text>
                                <Text className="ml-2">
                                    {orderStatus.total_amount.toLocaleString()}đ
                                </Text>
                            </List.Item>
                        </List>
                    </div>

                    <Divider />

                    <div className="mb-8">
                        <Title level={4}>Tiến trình đơn hàng</Title>
                        <Steps
                            current={getCurrentStep(orderStatus.status)}
                            className="mt-4"
                        >
                            <Step
                                title="Đã đặt hàng"
                                description={new Date(orderStatus.created_at).toLocaleString()}
                            />
                            <Step
                                title="Đang xử lý"
                                description={
                                    orderStatus.processing_at
                                        ? new Date(orderStatus.processing_at).toLocaleString()
                                        : "Chờ xử lý"
                                }
                            />
                            <Step
                                title="Đang vận chuyển"
                                description={
                                    orderStatus.shipped_at
                                        ? new Date(orderStatus.shipped_at).toLocaleString()
                                        : "Chờ vận chuyển"
                                }
                            />
                            <Step
                                title="Đã giao hàng"
                                description={
                                    orderStatus.delivered_at
                                        ? new Date(orderStatus.delivered_at).toLocaleString()
                                        : "Chờ giao hàng"
                                }
                            />
                        </Steps>
                    </div>

                    {trackingInfo && (
                        <>
                            <Divider />
                            <div className="mb-8">
                                <Title level={4}>Thông tin vận chuyển</Title>
                                <List>
                                    <List.Item>
                                        <Text strong>Đơn vị vận chuyển:</Text>
                                        <Text className="ml-2">{trackingInfo.carrier}</Text>
                                    </List.Item>
                                    <List.Item>
                                        <Text strong>Mã theo dõi:</Text>
                                        <Text className="ml-2">{trackingInfo.tracking_number}</Text>
                                    </List.Item>
                                    <List.Item>
                                        <Text strong>Dự kiến giao hàng:</Text>
                                        <Text className="ml-2">
                                            {new Date(trackingInfo.estimated_delivery).toLocaleString()}
                                        </Text>
                                    </List.Item>
                                </List>
                            </div>
                        </>
                    )}

                    <Space className="w-full justify-center">
                        <Button type="primary" onClick={() => navigate("/orders")}>
                            Xem lịch sử đơn hàng
                        </Button>
                        <Button onClick={() => navigate("/")}>Tiếp tục mua sắm</Button>
                    </Space>
                </Card>
            </div>
        </div>
    );
};

const getCurrentStep = (status) => {
    switch (status) {
        case "pending":
            return 0;
        case "processing":
            return 1;
        case "shipped":
            return 2;
        case "delivered":
            return 3;
        case "cancelled":
            return 0;
        default:
            return 0;
    }
};

export default OrderConfirmation; 