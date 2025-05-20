import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders } from "../../../../redux/orderSlice";
import React, { useEffect, useState } from "react";
import {
  FiClock,
  FiSettings,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import RateModal from "../ProductReviews";

const OrdersList = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleRateClick = (item) => {
    setSelectedOrderItem(item);
    setShowRateModal(true);
  };

  // Function to get icon and color based on status
  const getStatusIconAndColor = (status) => {
    switch (status) {
      case "pending":
        return { icon: <FiClock className="mr-1" />, color: "text-yellow-500" };
      case "processing":
        return {
          icon: <FiSettings className="mr-1" />,
          color: "text-blue-500",
        };
      case "shipped":
        return { icon: <FiTruck className="mr-1" />, color: "text-orange-500" };
      case "delivered":
        return {
          icon: <FiCheckCircle className="mr-1" />,
          color: "text-green-500",
        };
      case "cancelled":
        return { icon: <FiXCircle className="mr-1" />, color: "text-red-500" };
      default:
        return { icon: null, color: "text-gray-500" };
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );

  return (
    <div className="bg-white max-w-5xl mx-auto p-4 bg-gray-150 min-h-screen">
      {orders.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <p className="text-gray-500 text-lg">No orders found</p>
        </div>
      ) : (
        orders
          .flatMap((order) => order.subOrders)
          .map((sub, index) => {
            const { icon, color } = getStatusIconAndColor(sub.status);
            return (
              <div
                key={sub.sub_order_id}
                className={`bg-white rounded-lg shadow-md overflow-hidden ${index !==
                    orders.flatMap((order) => order.subOrders).length - 1
                    ? "mb-4"
                    : ""
                  }`}
              >
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
                      <p
                        className={`text-sm font-medium flex items-center ${color}`}
                      >
                        {icon}
                        Status: {sub.status}
                      </p>
                    </div>
                  </div>

                  <p className="text-lg font-semibold text-[#EE4D2D]">
                    Total: <span className="text-xs">đ</span>
                    {Number(sub.total_price).toLocaleString()}
                  </p>
                </div>

                {/* Sub-order Items */}
                <div className="p-4">
                  {sub.orderItems.length === 0 ? (
                    <p className="text-gray-500">No items in this order</p>
                  ) : (
                    sub.orderItems.map((item, itemIndex) => (
                      <div
                        key={item.order_item_id}
                        className={`flex items-start space-x-4 py-4 ${itemIndex !== 0 ? "border-t border-gray-200" : ""
                          }`}
                      >
                        <Link
                          to={`/product/${item.product.product_id - 1}`}
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
                            Variant: {item.productVariant.color}{" "}
                            {item.productVariant.size
                              ? `- ${item.productVariant.size}`
                              : ""}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 line-through">
                            Price: <span className="text-xs">đ</span>
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
                        onClick={() => handleRateClick(sub.orderItems[0])} // Gọi modal cho sản phẩm đầu tiên
                        className="bg-red-500 border border-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                      >
                        Rate
                      </button>
                      <Link
                        to={`/product/${sub.orderItems[0].product.product_id - 1
                          }`}
                        className="bg-blue-500 border border-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition text-center"
                      >
                        Buy Again
                      </Link>
                    </>
                  )}
                  <Link
                    to={`#`}
                    className="bg-blue-500 border border-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                  >
                    Contact Seller
                  </Link>
                </div>
              </div>
            );
          })
      )}

      {/* Display RateModal */}
      {selectedOrderItem && (
        <RateModal
          isOpen={showRateModal}
          onClose={() => setShowRateModal(false)}
          orderItem={selectedOrderItem}
        />
      )}
    </div>
  );
};

export default OrdersList;