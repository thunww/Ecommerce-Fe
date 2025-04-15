import React, { useState, useEffect } from "react";
import ShipperStatsCards from "../../components/shipper/ShipperStatsCards";
import OrdersTable from "../../components/shipper/OrdersTable";
import { FaSearch } from "react-icons/fa";

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

  useEffect(() => {
    // TODO: Fetch dashboard data from API
    setIsLoading(false);
  }, []);

  const filteredOrders = orders.filter((order) =>
    order.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <h2 className="text-xl font-semibold text-gray-800">Đơn hàng gần đây</h2>
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
                <OrdersTable orders={filteredOrders} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperDashboard;
