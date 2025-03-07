import React, { useState, useEffect } from "react";
import Sidebar from "../components/Header/SideBar";
import StatsCards from "../components/Header/StatsCards";
import OrdersTable from "../components/Header/OrdersTable";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <main className="flex-1 p-6">
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

      {/* Recent Orders */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-700">Đơn hàng gần đây</h2>
        </div>
        {loading ? (
          <div className="p-4 text-center">Đang tải dữ liệu...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Người nhận</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Địa chỉ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá trị</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian hoàn thành</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.address}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatCurrency(order.amount)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default Dashboard;