import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getOrderDetails,
  acceptOrder,
  completeOrder,
} from "../../redux/shipperSlice";

const ShipperOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.shipper);

  useEffect(() => {
    dispatch(getOrderDetails(orderId));
  }, [dispatch, orderId]);

  const handleAcceptOrder = async () => {
    try {
      await dispatch(acceptOrder(orderId)).unwrap();
      toast.success("Nhận đơn hàng thành công");
      navigate("/shipper/orders");
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra khi nhận đơn hàng");
    }
  };

  const handleCompleteOrder = async () => {
    try {
      await dispatch(completeOrder(orderId)).unwrap();
      toast.success("Hoàn thành đơn hàng thành công");
      navigate("/shipper/orders");
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra khi hoàn thành đơn hàng");
    }
  };

  // Format địa chỉ từ object thành string
  const formatAddress = (addressObj) => {
    if (!addressObj) return 'Không xác định';
    const parts = [
      addressObj.address_line,
      addressObj.city,
      addressObj.province,
      addressObj.postal_code
    ].filter(Boolean);
    return parts.join(', ');
  };

  // Format số tiền
  const formatCurrency = (amount) => {
    if (!amount) return '0 VNĐ';
    return parseFloat(amount).toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Không tìm thấy đơn hàng</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Chi tiết đơn hàng #{orderDetails.sub_order_id}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Thông tin đơn hàng
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    <p className={`font-medium ${
                      orderDetails.status === "processing" ? "text-yellow-600" :
                      orderDetails.status === "shipped" ? "text-blue-600" :
                      orderDetails.status === "delivered" ? "text-green-600" :
                      orderDetails.status === "cancelled" ? "text-red-600" :
                      "text-gray-600"
                    }`}>
                      {orderDetails.status === "processing"
                        ? "Đang xử lý"
                        : orderDetails.status === "shipped"
                        ? "Đang giao hàng"
                        : orderDetails.status === "delivered"
                        ? "Đã hoàn thành"
                        : orderDetails.status === "cancelled"
                        ? "Đã hủy"
                        : "Không xác định"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày tạo</p>
                    <p className="font-medium">
                      {orderDetails.created_at ? new Date(orderDetails.created_at).toLocaleString() : 'Không xác định'}
                    </p>
                  </div>
                  {orderDetails.status === "delivered" && orderDetails.shipment?.actual_delivery_date && (
                    <div>
                      <p className="text-sm text-gray-500">Ngày hoàn thành</p>
                      <p className="font-medium text-green-600">
                        {new Date(orderDetails.shipment.actual_delivery_date).toLocaleString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Tổng tiền</p>
                    <p className="font-medium">
                      {formatCurrency(orderDetails.total_price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phí vận chuyển</p>
                    <p className="font-medium">
                      {formatCurrency(orderDetails.shipping_fee)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Thông tin khách hàng
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Tên khách hàng</p>
                    <p className="font-medium">{orderDetails.Order?.customer_name || 'Không xác định'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium">{orderDetails.Order?.phone || 'Không xác định'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
                    <p className="font-medium">{formatAddress(orderDetails.Order?.shipping_address)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex space-x-4">
              {orderDetails.status === "processing" && !orderDetails.shipment?.shipper_id && (
                <button
                  onClick={handleAcceptOrder}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Nhận đơn hàng
                </button>
              )}
              {orderDetails.status === "shipped" && orderDetails.shipment?.shipper_id && (
                <button
                  onClick={handleCompleteOrder}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Hoàn thành đơn hàng
                </button>
              )}
              <button
                onClick={() => navigate("/shipper/orders")}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperOrderDetail;
