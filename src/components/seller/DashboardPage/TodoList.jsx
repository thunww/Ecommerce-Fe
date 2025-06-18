import React, { useState, useEffect } from "react";
import { getOrderStats } from "../../../services/vendorService";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useSelector } from "react-redux";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip);

const ToDoList = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    ordersByStatus: {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy user và roles từ Redux store
  const { user, roles } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Kiểm tra trạng thái đăng nhập và vai trò từ Redux store
        if (!user || !user.user_id) {
          throw new Error("You are not logged in");
        }
        if (!roles.includes("vendor")) {
          throw new Error("You don't have permission to access this page");
        }

        const response = await getOrderStats();
        setStats(response);
      } catch (error) {
        setError(error.message || "Error loading data");
        console.error("Error fetching order stats:", error);
      } finally {
        setLoading(false);
      }
    };

    // Chỉ gọi fetchOrderStats nếu user và roles đã có (người dùng đã đăng nhập và được xác định)
    if (user && roles.length > 0) {
      fetchOrderStats();
    }
  }, [user, roles]); // Thêm user và roles vào dependency array

  // Chart data
  const chartData = {
    labels: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    datasets: [
      {
        label: "Order Status Statistics",
        data: [
          stats.ordersByStatus.pending,
          stats.ordersByStatus.processing,
          stats.ordersByStatus.shipped,
          stats.ordersByStatus.delivered,
          stats.ordersByStatus.cancelled,
        ],
        backgroundColor: [
          "#3B82F6",
          "#F59E0B",
          "#8B5CF6",
          "#10B981",
          "#EF4444",
        ],
        borderColor: ["#2563EB", "#D97706", "#7C3AED", "#059669", "#DC2626"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Number of Orders" },
      },
      x: {
        title: { display: true, text: "Order Status" },
      },
    },
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Order Status Statistics" },
    },
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Status Statistics Chart */}
      <div>
        <h2 className="text-xl font-bold mb-4">Order Status Statistics</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Top Selling Products */}
      {stats.topProducts && stats.topProducts.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Top Selling Products</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.topProducts.map((product) => (
                  <tr key={product.productId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${product.revenue.toLocaleString("en-US")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      {stats.recentOrders && stats.recentOrders.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentOrders.map((order) => (
                  <tr key={order.orderId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${order.totalAmount.toLocaleString("en-US")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(order.orderDate).toLocaleDateString("en-US")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToDoList;
