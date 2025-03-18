import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

const ShipperDashboard = () => {
  const [stats, setStats] = useState({
    todayOrders: 124,
    completedOrders: 104,
    pendingOrders: 24,
    todayRevenue: "50.004 đ"
  });

  const [orders, setOrders] = useState([
    {
      id: "DH001",
      customerName: "Nguyễn Văn A",
      address: "123 Nguyễn Văn Cừ, Quận 5, TP.HCM",
      phone: "0901234567",
      total: "150.000 đ",
      status: "pending", // pending, accepted, completed
      time: "10:30 AM"
    },
    {
      id: "DH002",
      customerName: "Trần Thị B",
      address: "456 Lê Lợi, Quận 1, TP.HCM",
      phone: "0907654321",
      total: "200.000 đ",
      status: "pending",
      time: "11:00 AM"
    },
    {
      id: "DH003",
      customerName: "Phạm Văn C",
      address: "789 Cách Mạng Tháng 8, Quận 3, TP.HCM",
      phone: "0909876543",
      total: "180.000 đ",
      status: "accepted",
      time: "11:30 AM"
    }
  ]);

  const handleAcceptOrder = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: "accepted" }
        : order
    ));
  };

  const handleCompleteOrder = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: "completed" }
        : order
    ));

    // Cập nhật thống kê
    setStats(prev => ({
      ...prev,
      completedOrders: prev.completedOrders + 1,
      pendingOrders: prev.pendingOrders - 1
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ nhận";
      case "accepted":
        return "Đang giao";
      case "completed":
        return "Đã giao";
      default:
        return "Không xác định";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Xin chào, đây là bảng điều khiển giao hàng của bạn
        </h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500">Đơn hàng hôm nay</div>
            <div className="text-2xl font-bold text-gray-800">{stats.todayOrders}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500">Đã giao thành công</div>
            <div className="text-2xl font-bold text-green-600">{stats.completedOrders}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500">Đang chờ giao</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500">Tổng doanh thu hôm nay</div>
            <div className="text-2xl font-bold text-blue-600">{stats.todayRevenue}</div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Danh sách đơn hàng</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        to={`/shipper/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {order.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{order.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.total}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {order.status === "pending" && (
                        <button
                          onClick={() => handleAcceptOrder(order.id)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Nhận đơn
                        </button>
                      )}
                      {order.status === "accepted" && (
                        <button
                          onClick={() => handleCompleteOrder(order.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Đánh dấu đã giao
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperDashboard;
