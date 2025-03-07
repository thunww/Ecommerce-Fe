import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import StatsCards from "../components/Header/StatsCards";
import OrdersTable from "../components/Header/OrdersTable";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/orders/stats");
        const data = await response.json();

        setStats({
          totalOrders: data.totalOrders,
          completedOrders: data.completedOrders,
          pendingOrders: data.pendingOrders,
          totalRevenue: data.totalRevenue,
        });

        setRecentOrders(data.recentOrders);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex-1 flex flex-col relative">
      {/* Header */}
      <Header />

      {/* Notification Bell & User Menu */}
      <div className="absolute top-4 right-6 flex items-center space-x-4">
        {/* Online/Offline Toggle */}
        <button 
          onClick={() => setIsOnline(!isOnline)} 
          className={`px-4 py-2 rounded-full text-white ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}
        >
          {isOnline ? "Online" : "Offline"}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 bg-gray-200 rounded-full">
            🔔
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                {notifications.length}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4">
              <h3 className="text-sm font-semibold border-b pb-2">Thông báo</h3>
              {notifications.length === 0 ? (
                <p className="text-xs text-gray-500 mt-2">Không có thông báo nào</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {notifications.map((notification, index) => (
                    <li key={index} className="text-xs text-gray-700 border-b pb-2">
                      {notification}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* User Profile & Logout */}
        <div className="relative">
          <button className="p-2 bg-gray-200 rounded-full">👤</button>
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2">
            <button 
              onClick={() => navigate("/shipper/profile")} 
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Xem hồ sơ
            </button>
            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Đăng xuất</button>
          </div>
        </div>
      </div>

      <main className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Xin chào, đây là bảng điều khiển giao hàng của bạn.</p>

        {/* Stats Cards */}
        <div className="mt-6">
          <StatsCards stats={stats} />
        </div>

        {/* Orders Table */}
        <div className="mt-8">
          <OrdersTable />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
