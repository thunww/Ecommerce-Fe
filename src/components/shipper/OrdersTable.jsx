import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const OrdersTable = ({ orders, onOrderUpdate }) => {
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    console.log("All orders:", orders);
    console.log(
      "Order statuses:",
      orders.map((order) => ({
        id: order.sub_order_id,
        status: order.status,
        rawStatus: order.rawStatus,
      }))
    );
  }, [orders]);

  const filteredOrders = orders.filter((order) => {
    return activeTab === "active"
      ? order.rawStatus !== "cancelled"
      : order.rawStatus === "cancelled";
  });

  const handleAcceptOrder = async (orderId) => {
    try {
      const response = await axiosClient.post(
        `/shippers/sub_orders/${orderId}/accept`
      );
      if (response.data.success) {
        toast.success("Nhận đơn hàng thành công");
        if (onOrderUpdate) onOrderUpdate();
      }
    } catch (error) {
      console.error("Error accepting order:", error);
      toast.error(error.response?.data?.message || "Không thể nhận đơn hàng");
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      const response = await axiosClient.post(
        `/shippers/sub_orders/${orderId}/complete`
      );
      if (response.data.success) {
        toast.success("Hoàn thành đơn hàng thành công");
        if (onOrderUpdate) onOrderUpdate();
      }
    } catch (error) {
      console.error("Error completing order:", error);
      toast.error(
        error.response?.data?.message || "Không thể hoàn thành đơn hàng"
      );
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axiosClient.post(
        `/shippers/sub_orders/${orderId}/cancel`
      );
      if (response.data.success) {
        toast.success("Hủy đơn hàng thành công");
        if (onOrderUpdate) onOrderUpdate();
      }
    } catch (error) {
      console.error("Error canceling order:", error);
      toast.error(error.response?.data?.message || "Không thể hủy đơn hàng");
    }
  };

  const renderActionButtons = (order) => {
    if (order.rawStatus === "processing") {
      return (
        <button
          onClick={() => handleAcceptOrder(order.sub_order_id)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
        >
          Nhận đơn
        </button>
      );
    } else if (order.rawStatus === "shipped") {
      return (
        <div className="flex space-x-2">
          <button
            onClick={() => handleCompleteOrder(order.sub_order_id)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Hoàn thành
          </button>
          <button
            onClick={() => handleCancelOrder(order.sub_order_id)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Hủy đơn
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="mb-4 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              onClick={() => setActiveTab("active")}
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === "active"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              Đơn hàng đang hoạt động
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setActiveTab("cancelled")}
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === "cancelled"
                  ? "text-red-600 border-red-600"
                  : "text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              Đơn hàng đã hủy (
              {orders.filter((order) => order.rawStatus === "cancelled").length}
              )
            </button>
          </li>
        </ul>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {activeTab === "active"
              ? "Không có đơn hàng đang hoạt động"
              : "Không có đơn hàng đã hủy"}
          </p>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã đơn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Địa chỉ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              {activeTab === "active" && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <Link
                    to={`/shipper/orders/${order.sub_order_id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {order.id}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center overflow-hidden">
                      {order.customerAvatar ? (
                        <img
                          src={
                            order.customerAvatar.startsWith("http")
                              ? order.customerAvatar
                              : `http://localhost:8080${order.customerAvatar}`
                          }
                          alt={order.customerName}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://www.gravatar.com/avatar/?d=mp";
                          }}
                        />
                      ) : (
                        <span className="text-gray-500 text-lg font-semibold">
                          {order.customerName !== "Không xác định"
                            ? order.customerName.charAt(0).toUpperCase()
                            : "K"}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.customerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.customerPhone}
                      </div>
                      {order.customerEmail && (
                        <div className="text-xs text-gray-400">
                          {order.customerEmail}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {order.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{order.time}</div>
                  {order.deliveredTime && (
                    <div className="text-green-600 text-xs mt-1">
                      Hoàn thành: {order.deliveredTime}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      order.rawStatus === "processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.rawStatus === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : order.rawStatus === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.rawStatus === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                {activeTab === "active" && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {renderActionButtons(order)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrdersTable;
