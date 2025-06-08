import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders } from "../../../../redux/orderSlice";
import {
  FiClock,
  FiSettings,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import RateModal from "../ProductReviews";

const OrderItem = ({ sub, handleRateClick }) => {
  const statusStyles = {
    pending: {
      icon: <FiClock className="mr-1" />,
      color: "text-yellow-500",
      label: "Thanh toán",
    },
    processing: {
      icon: <FiSettings className="mr-1" />,
      color: "text-blue-500",
      label: "Đang xử lý",
    },
    shipped: {
      icon: <FiTruck className="mr-1" />,
      color: "text-orange-500",
      label: "Vận chuyển",
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

  const { icon, color, label } = statusStyles[sub.status] || {
    icon: null,
    color: "text-gray-500",
    label: sub.status,
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
              Trạng thái: {label}
            </p>
          </div>
        </div>
        <p className="text-lg font-semibold text-blue-500">
          Tổng: <span className="text-xs">đ</span>
          {Number(sub.total_price).toLocaleString()}
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
                    ? `- ${item.productVariant.size}`
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
                  {Number(item.total).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sub-order Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-2">
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

  const tabs = [
    { id: "all", label: "Tất cả" },
    { id: "pending", label: "Chờ thanh toán" },
    { id: "processing", label: "Đang xử lý" },
    { id: "shipped", label: "Vận chuyển" },
    { id: "delivered", label: "Hoàn thành" },
    { id: "cancelled", label: "Đã hủy" },
  ];

  const filteredOrders = orders
    .flatMap((order) => order.subOrders)
    .filter((sub) => activeTab === "all" || sub.status === activeTab);

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
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-600 hover:bg-blue-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div>
          {filteredOrders.length === 0 ? (
            <EmptyState />
          ) : (
            filteredOrders.map((sub) => (
              <OrderItem
                key={sub.sub_order_id}
                sub={sub}
                handleRateClick={handleRateClick}
              />
            ))
          )}
        </div>

        {/* Rate Modal */}
        {selectedOrderItem && (
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
