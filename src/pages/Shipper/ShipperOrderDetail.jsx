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
              Chi tiết đơn hàng #{orderDetails.id}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Thông tin đơn hàng
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    <p className="font-medium">
                      {orderDetails.status === "pending"
                        ? "Đang chờ"
                        : orderDetails.status === "in_transit"
                        ? "Đang giao"
                        : orderDetails.status === "delivered"
                        ? "Đã giao"
                        : "Đã hủy"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày tạo</p>
                    <p className="font-medium">
                      {new Date(orderDetails.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tổng tiền</p>
                    <p className="font-medium">
                      {orderDetails.total.toLocaleString()} VNĐ
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
                    <p className="font-medium">{orderDetails.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium">{orderDetails.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
                    <p className="font-medium">{orderDetails.deliveryAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex space-x-4">
              {orderDetails.status === "pending" && (
                <button
                  onClick={handleAcceptOrder}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Nhận đơn hàng
                </button>
              )}
              {orderDetails.status === "in_transit" && (
                <button
                  onClick={handleCompleteOrder}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
