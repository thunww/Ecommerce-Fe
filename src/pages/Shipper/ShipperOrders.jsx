import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ShipperSidebar from "../../components/shipper/ShipperSidebar";
import OrdersTable from "../../components/shipper/OrdersTable";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { getOrders, getOrderDetails, acceptOrder, completeOrder } from "../../redux/shipperSlice";

const ShipperOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shipper, orders, loading, error } = useSelector((state) => state.shipper);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleOrderClick = async (orderId) => {
    setIsLoading(true);
    try {
      const order = await dispatch(getOrderDetails(orderId)).unwrap();
      setSelectedOrder(order);
    } catch (err) {
      toast.error(err);
    } finally {
      setIsLoading(false);
    }
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

        {/* Order Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Chi tiết đơn hàng</h2>
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
              </div>
            ) : selectedOrder ? (
              <div>
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700">Thông tin đơn hàng</h3>
                  <p className="text-sm text-gray-600">Mã đơn: {selectedOrder.id}</p>
                  <p className="text-sm text-gray-600">
                    Ngày đặt: {new Date(selectedOrder.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Trạng thái:{' '}
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedOrder.status === 'waiting'
                          ? 'bg-yellow-100 text-yellow-800'
                          : selectedOrder.status === 'in_transit'
                          ? 'bg-purple-100 text-purple-800'
                          : selectedOrder.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {selectedOrder.status === 'waiting'
                        ? 'Chờ nhận'
                        : selectedOrder.status === 'in_transit'
                        ? 'Đang giao'
                        : selectedOrder.status === 'delivered'
                        ? 'Đã giao'
                        : 'Thất bại'}
                    </span>
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium text-gray-700">Thông tin khách hàng</h3>
                  <p className="text-sm text-gray-600">{selectedOrder.customerName}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customerPhone}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.shippingAddress}</p>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium text-gray-700">Sản phẩm</h3>
                  {selectedOrder.items?.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm text-gray-600">
                      <span>{item.name}</span>
                      <span>{item.quantity} x {item.price.toLocaleString('vi-VN')}đ</span>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <h3 className="font-medium text-gray-700">Tổng cộng</h3>
                  <p className="text-lg font-semibold text-red-600">
                    {selectedOrder.totalAmount.toLocaleString('vi-VN')}đ
                  </p>
                </div>

                {selectedOrder.status === 'waiting' && (
                  <button
                    onClick={() => handleAcceptOrder(selectedOrder._id)}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                  >
                    Nhận đơn hàng
                  </button>
                )}

                {selectedOrder.status === 'in_transit' && (
                  <button
                    onClick={() => handleCompleteOrder(selectedOrder._id)}
                    className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                  >
                    Hoàn thành đơn hàng
                  </button>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Chọn một đơn hàng để xem chi tiết</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperOrders;
