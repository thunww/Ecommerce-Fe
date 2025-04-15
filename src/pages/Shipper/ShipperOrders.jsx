import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShipperSidebar from "../../components/shipper/ShipperSidebar";
import OrdersTable from "../../components/shipper/OrdersTable";
import { FaSearch } from "react-icons/fa";

const ShipperOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch orders from API
    setIsLoading(false);
  }, []);

  const handleOrderClick = (orderId) => {
    navigate(`/shipper/orders/${orderId}`);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesDate = dateFilter === "all" || order.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full flex flex-col p-6">
        {/* Header and Filters */}
        <div className="space-y-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Danh sách đơn hàng</h1>
          
          <div className="flex flex-wrap gap-4">
            {/* Search Input */}
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

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-48 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Đang chờ</option>
              <option value="processing">Đang xử lý</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full md:w-48 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
            >
              <option value="all">Tất cả ngày</option>
              <option value="today">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-auto">
                <OrdersTable
                  orders={filteredOrders}
                  onOrderClick={handleOrderClick}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipperOrders;
