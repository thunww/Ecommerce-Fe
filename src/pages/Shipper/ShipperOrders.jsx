import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ShipperSidebar from "../../components/shipper/ShipperSidebar";
import OrdersTable from "../../components/shipper/OrdersTable";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { getOrders, acceptOrder, completeOrder } from "../../redux/shipperSlice";

const ShipperOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shipper, orders = [], loading, error } = useSelector((state) => state.shipper);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleOrderClick = (orderId) => {
    navigate(`/shipper/orders/${orderId}`);
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await dispatch(acceptOrder(orderId)).unwrap();
      toast.success('Đã nhận đơn hàng thành công');
      dispatch(getOrders());
    } catch (err) {
      toast.error(err);
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      await dispatch(completeOrder(orderId)).unwrap();
      toast.success('Đã hoàn thành đơn hàng');
      dispatch(getOrders());
    } catch (err) {
      toast.error(err);
    }
  };

  const filteredOrders = Array.isArray(orders) ? orders.filter((order) => {
    const matchesSearch = order.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesDate = dateFilter === "all" || order.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  }) : [];

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full flex flex-col p-6">
        {/* Header and Filters */}
        <div className="space-y-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Danh sách đơn hàng</h1>
          
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>

            {/* Status Filter */}
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="waiting">Chờ nhận</option>
              <option value="in_transit">Đang giao</option>
              <option value="delivered">Đã giao</option>
              <option value="failed">Thất bại</option>
            </select>

            {/* Date Filter */}
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">Tất cả ngày</option>
              <option value="today">Hôm nay</option>
              <option value="this_week">Tuần này</option>
              <option value="this_month">Tháng này</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
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
