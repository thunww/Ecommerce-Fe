import React, { useState, useEffect } from "react";
import ShipperStatsCards from "../../components/shipper/ShipperStatsCards";
import OrdersTable from "../../components/shipper/OrdersTable";
import { FaSearch } from "react-icons/fa";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";

const ShipperDashboard = () => {
  const [stats, setStats] = useState({
    todayOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    todayRevenue: "0 đ",
  });

  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Lấy danh sách đơn hàng gần đây
      const ordersResponse = await axiosClient.get("/shippers/sub_orders");
      console.log("Orders Response:", ordersResponse.data);

      const allOrders = ordersResponse.data.data || [];
      console.log("All orders:", allOrders);

      // Calculate stats from orders data
      const calculatedStats = {
        todayOrders: allOrders.filter((order) =>
          order.created_at?.startsWith(new Date().toISOString().split("T")[0])
        ).length,
        completedOrders: allOrders.filter(
          (order) => order.status === "delivered"
        ).length,
        pendingOrders: allOrders.filter(
          (order) => order.status === "processing" || order.status === "shipped"
        ).length,
        todayRevenue: new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(
          allOrders
            .filter(
              (order) =>
                order.status === "delivered" &&
                order.updated_at?.startsWith(
                  new Date().toISOString().split("T")[0]
                )
            )
            .reduce(
              (sum, order) => sum + (parseFloat(order.shipping_fee) || 0),
              0
            )
        ),
      };

      setStats(calculatedStats);

      // Không lọc đơn hàng theo trạng thái nữa
      const transformedOrders = allOrders.map((order) => {
        const formatAddress = (addressObj) => {
          if (!addressObj) return "Không xác định";
          const parts = [
            addressObj.address_line,
            addressObj.city,
            addressObj.province,
            addressObj.postal_code,
          ].filter(Boolean);
          return parts.join(", ");
        };

        const user = order.Order?.User || {};
        const fullName =
          user.first_name && user.last_name
            ? `${user.first_name} ${user.last_name}`
            : "Không xác định";

        console.log("User data:", {
          fullName,
          profile_picture: user.profile_picture,
          user,
        });

        return {
          id: order.sub_order_id?.toString() || "Không xác định",
          customerName: fullName,
          customerPhone: user.phone || "Không có SĐT",
          customerEmail: user.email || "",
          customerAvatar: user.profile_picture || null,
          address: formatAddress(order.Order?.shipping_address),
          time: order.created_at
            ? new Date(order.created_at).toLocaleString()
            : "Không xác định",
          deliveredTime:
            order.status === "delivered" && order.shipment?.actual_delivery_date
              ? new Date(order.shipment.actual_delivery_date).toLocaleString()
              : null,
          total: parseFloat(order.total_price || 0).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }),
          status:
            order.status === "processing"
              ? "Đang xử lý"
              : order.status === "shipped"
              ? "Đang giao hàng"
              : order.status === "delivered"
              ? "Đã hoàn thành"
              : order.status === "cancelled"
              ? "Đã hủy"
              : "Không xác định",
          rawStatus: order.status,
          sub_order_id: order.sub_order_id,
          shipment: order.shipment,
        };
      });

      setOrders(transformedOrders);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      console.error("Error response:", error.response);
      toast.error("Không thể tải dữ liệu đơn hàng");

      // Set default stats on error
      setStats({
        todayOrders: 0,
        completedOrders: 0,
        pendingOrders: 0,
        todayRevenue: "0 đ",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAcceptOrder = async (orderId) => {
    try {
      const response = await axiosClient.post(
        `/shippers/sub_orders/${orderId}/accept`
      );

      if (response.data.success) {
        toast.success("Nhận đơn hàng thành công");
        fetchDashboardData(); // Refresh data
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
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error("Error completing order:", error);
      toast.error(
        error.response?.data?.message || "Không thể hoàn thành đơn hàng"
      );
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <button
          onClick={() => handleCompleteOrder(order.sub_order_id)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Hoàn thành
        </button>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full flex flex-col p-4 md:p-6 space-y-6">
        {/* Stats Section */}
        <div className="w-full">
          <ShipperStatsCards stats={stats} />
        </div>

        {/* Recent Orders Section */}
        <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Đơn hàng gần đây
              </h2>
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Tìm kiếm đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <OrdersTable
                  orders={filteredOrders}
                  onOrderUpdate={fetchDashboardData}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperDashboard;
