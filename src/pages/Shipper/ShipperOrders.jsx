import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrdersTable from "../../components/shipper/OrdersTable";
import { FaSearch, FaFilter } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from 'axios';

const ShipperOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');

      if (!token) {
        toast.error('Vui lòng đăng nhập lại');
        return;
      }

      const API_URL = 'http://localhost:8080';
      const response = await axios.get(
        `${API_URL}/api/v1/shippers/sub_orders`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        const transformedOrders = response.data.data.map(order => {
          const formatAddress = (addressObj) => {
            if (!addressObj) return 'Không xác định';
            const parts = [
              addressObj.address_line,
              addressObj.city,
              addressObj.province,
              addressObj.postal_code
            ].filter(Boolean);
            return parts.join(', ');
          };

          const user = order.Order?.User || {};
          const fullName = user.first_name && user.last_name ?
            `${user.first_name} ${user.last_name}` : 'Không xác định';

          return {
            id: order.sub_order_id?.toString() || 'Không xác định',
            sub_order_id: order.sub_order_id,
            customerName: fullName,
            customerPhone: user.phone || 'Không có SĐT',
            customerEmail: user.email || '',
            address: formatAddress(order.Order?.shipping_address),
            time: order.created_at ? new Date(order.created_at).toLocaleString() : 'Không xác định',
            deliveredTime: order.status === 'delivered' && order.shipment?.actual_delivery_date
              ? new Date(order.shipment.actual_delivery_date).toLocaleString()
              : null,
            total: parseFloat(order.shipping_fee || 0).toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }),
            status: order.status === 'processing' ? 'Đang xử lý'
              : order.status === 'shipped' ? 'Đang giao hàng'
                : order.status === 'delivered' ? 'Đã hoàn thành'
                  : order.status === 'cancelled' ? 'Đã hủy'
                    : 'Không xác định',
            rawStatus: order.status
          };
        });
        setOrders(transformedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(error.response?.data?.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      order.rawStatus === statusFilter;

    // Implement date filtering if needed
    const matchesDate = true; // For now, we'll skip date filtering

    return matchesSearch && matchesStatus && matchesDate;
  });

  const filterOptions = [
    { value: 'all', label: 'Tất cả đơn' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'shipped', label: 'Đang giao' },
    { value: 'delivered', label: 'Đã hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-semibold text-gray-800">Danh sách đơn hàng</h1>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              {/* Search Box */}
              <div className="relative flex-1 md:flex-none md:w-64">
                <input
                  type="text"
                  placeholder="Tìm kiếm đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  <FaFilter className="text-gray-500" />
                  <span>
                    {filterOptions.find(option => option.value === statusFilter)?.label}
                  </span>
                </button>

                {showFilterMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                    {filterOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setStatusFilter(option.value);
                          setShowFilterMenu(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${statusFilter === option.value
                            ? 'bg-red-50 text-red-700'
                            : 'text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Không tìm thấy đơn hàng nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <OrdersTable
                orders={filteredOrders}
                onOrderUpdate={fetchOrders}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipperOrders;
