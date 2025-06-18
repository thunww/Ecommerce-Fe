import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, cancelSubOrder } from "../../../../redux/orderSlice";
import {
  FiClock,
  FiSettings,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiSmartphone,
  FiCreditCard,
  FiPackage,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import RateModal from "../ProductReviews";
import Swal from "sweetalert2";

const OrderItem = ({ sub, order, handleRateClick, handleCancelOrder }) => {
  const statusStyles = {
    pending: {
      icon: <FiClock className="mr-1" />,
      color: "text-yellow-500",
      label: "Chờ xử lý",
    },
    processing: {
      icon: <FiSettings className="mr-1" />,
      color: "text-blue-500",
      label: "Đang xử lý",
    },
    shipped: {
      icon: <FiTruck className="mr-1" />,
      color: "text-orange-500",
      label: "Đang giao hàng",
    },
    delivered: {
      icon: <FiCheckCircle className="mr-1" />,
      color: "text-green-500",
      label: "Hoàn thành",
    },
    cancelled: {
      icon: <FiXCircle className="mr-1" />,
      color: "text-red-500",
      label: "Đã hủy",
    },
  };

  const paymentStatusStyles = {
    pending: {
      icon: <FiClock className="mr-1" />,
      color: "text-yellow-500",
      label: "Chờ thanh toán",
    },
    paid: {
      icon: <FiCheckCircle className="mr-1" />,
      color: "text-green-500",
      label: "Đã thanh toán",
    },
    failed: {
      icon: <FiXCircle className="mr-1" />,
      color: "text-red-500",
      label: "Thất bại",
    },
  };

  const paymentMethodLabels = {
    momo: { icon: <FiSmartphone className="mr-1" />, label: "MoMo" },
    vnpay: { icon: <FiCreditCard className="mr-1" />, label: "VNPay" },
    cod: {
      icon: <FiPackage className="mr-1" />,
      label: "Thanh toán khi nhận hàng",
    },
  };

  const { icon, color, label } = statusStyles[sub.status] || {
    icon: null,
    color: "text-gray-500",
    label: sub.status || "Không xác định",
  };

  // Lấy thông tin thanh toán (dùng order.payment_status, order.payment_method)
  const {
    icon: paymentIcon,
    color: paymentColor,
    label: paymentLabel,
  } = paymentStatusStyles[order?.payment_status] || {
    icon: null,
    color: "text-gray-500",
    label: "Không xác định",
  };

  const { icon: methodIcon, label: paymentMethod } = paymentMethodLabels[
    order?.payment_method
  ] || {
    icon: null,
    label: order?.payment_method || "Không xác định",
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      {/* Sub-order Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-300">
        <div className="flex items-center space-x-2">
          <img
            src={sub.shop.logo}
            alt="Shop Logo"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="text-lg font-semibold text-gray-800">
              {sub.shop.shop_name}
            </p>
            <p className={`text-sm font-medium flex items-center ${color}`}>
              {icon}
              Trạng thái đơn hàng: {label}
            </p>

            {/* Ẩn nếu sub.status === "cancelled" */}
            {sub.status !== "cancelled" && (
              <>
                <p className="text-sm font-medium flex items-center text-gray-600">
                  {methodIcon}
                  Phương thức thanh toán: {paymentMethod}
                </p>
              </>
            )}
          </div>
        </div>
        <p className="text-lg font-semibold text-red-500">
          Tổng: <span className="text-xs">đ</span>
          {Number(order.total_price).toLocaleString()}
        </p>
      </div>

      {/* Sub-order Items */}
      <div className="p-4">
        {sub.orderItems.length === 0 ? (
          <p className="text-gray-500">Không có sản phẩm trong đơn hàng</p>
        ) : (
          sub.orderItems.map((item, itemIndex) => (
            <div
              key={item.order_item_id}
              className={`flex items-start space-x-4 py-4 ${
                itemIndex !== 0 ? "border-t border-gray-200" : ""
              }`}
            >
              <Link
                to={`/product/${item.product.product_id}`}
                className="w-20 h-20 rounded-md object-cover"
              >
                <img
                  src={item.productVariant.image_url}
                  alt={item.product.product_name}
                  className="w-full h-full object-cover"
                />
              </Link>
              <div className="flex-1">
                <p className="text-base font-medium text-gray-800">
                  {item.product.product_name}
                </p>
                <p className="text-sm text-gray-500">
                  Phân loại: {item.productVariant.color}{" "}
                  {item.productVariant.size
                    ? ` - ${item.productVariant.size}`
                    : ""}
                </p>
                <p className="text-sm text-gray-500">
                  Số lượng: {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 line-through">
                  Giá: <span className="text-xs">đ</span>
                  {Number(item.price).toLocaleString()}
                </p>
                <p className="text-base font-semibold text-gray-800">
                  <span className="text-xs">đ</span>
                  {Number(item.total - item.discount).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sub-order Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-2">
        {sub.status === "pending" && (
          <button
            onClick={() => handleCancelOrder(sub.sub_order_id)}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Hủy đơn hàng
          </button>
        )}
        {sub.status === "delivered" && sub.orderItems.length > 0 && (
          <>
            <button
              onClick={() => handleRateClick(sub.orderItems[0])}
              className="bg-red-500 border border-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              Đánh giá
            </button>
            <Link
              to={`/product/${sub.orderItems[0].product.product_id}`}
              className="bg-blue-500 border border-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition text-center"
            >
              Mua lại
            </Link>
          </>
        )}
        <Link
          to={`#`}
          className="bg-blue-500 border border-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Liên hệ người bán
        </Link>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm text-center">
    <p className="text-gray-500 text-lg">Không tìm thấy đơn hàng</p>
  </div>
);

const OrdersList = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);
  const [activeTab, setActiveTab] = useState("all");
  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleRateClick = (item) => {
    setSelectedOrderItem(item);
    setShowRateModal(true);
  };

  const handleCancelOrder = async (subOrderId) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn hủy đơn hàng?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Hủy đơn",
      cancelButtonText: "Không",
    });

    if (result.isConfirmed) {
      try {
        await dispatch(cancelSubOrder(subOrderId)).unwrap();
        dispatch(fetchAllOrders());
        Swal.fire("Đã hủy!", "Đơn hàng đã được hủy thành công.", "success");
      } catch (error) {
        Swal.fire("Thất bại", error.message || "Không thể hủy đơn", "error");
      }
    }
  };

  const tabs = [
    { id: "all", label: "Tất cả" },
    { id: "payment_pending", label: "Chờ thanh toán" },
    { id: "pending_processing", label: "Đang xử lý" },
    { id: "shipped", label: "Đang giao hàng" },
    { id: "delivered", label: "Hoàn thành" },
    { id: "cancelled", label: "Đã hủy" },
  ];

  const filteredOrders = orders
    .flatMap((order) => order.subOrders.map((sub) => ({ sub, order })))
    .filter(({ sub, order }) => {
      if (activeTab === "all") return true;
      if (activeTab === "payment_pending")
        return order.payment_status === "pending" && sub.status !== "cancelled";
      if (activeTab === "pending_processing")
        return sub.status === "pending" || sub.status === "processing";
      return sub.status === activeTab;
    });

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto p-4">
        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2 rounded-md font-medium text-center transition ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <EmptyState />
        ) : (
          filteredOrders.map(({ sub, order }) => (
            <OrderItem
              key={sub.sub_order_id}
              sub={sub}
              order={order}
              handleRateClick={handleRateClick}
              handleCancelOrder={handleCancelOrder}
            />
          ))
        )}

        {/* Modal đánh giá */}
        {showRateModal && selectedOrderItem && (
          <RateModal
            isOpen={showRateModal}
            onClose={() => setShowRateModal(false)}
            orderItem={selectedOrderItem}
          />
        )}
      </div>
    </div>
  );
};

export default OrdersList;
