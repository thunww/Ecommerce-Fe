import React, { useState, useEffect } from "react";
import OrdersTable from "../../components/shipper/OrdersTable";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const ShipperOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        toast.error('Vui lòng đăng nhập lại');
        return;
      }

      const API_URL = 'http://localhost:8080';
      const response = await axios.get(`${API_URL}/api/v1/shippers/sub_orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Orders Response:', response.data);
      const allOrders = response.data.data || [];
      console.log('All orders:', allOrders);

      const transformedOrders = allOrders.map(order => {
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

        const user = order.order?.User || {};
        console.log('Processing order:', {
          orderId: order.sub_order_id,
          user: user,
          profile_picture: user.profile_picture,
          rawOrder: order
        });

        const fullName = user.first_name && user.last_name ? 
          `${user.first_name} ${user.last_name}` : 'Không xác định';

        return {
          id: order.sub_order_id?.toString() || 'Không xác định',
          customerName: fullName,
          customerPhone: user.phone || 'Không có SĐT',
          customerEmail: user.email || '',
          customerAvatar: user.profile_picture || null,
          address: formatAddress(order.order?.shipping_address),
          time: order.created_at ? new Date(order.created_at).toLocaleString() : 'Không xác định',
          deliveredTime: order.status === 'delivered' && order.shipment?.actual_delivery_date 
            ? new Date(order.shipment.actual_delivery_date).toLocaleString() 
            : null,
          total: parseFloat(order.total_price || 0).toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }),
          status: order.status === 'processing' ? 'Đang xử lý' 
                 : order.status === 'shipped' ? 'Đang giao hàng'
                 : order.status === 'delivered' ? 'Đã hoàn thành'
                 : order.status === 'cancelled' ? 'Đã hủy'
                 : 'Không xác định',
          rawStatus: order.status,
          sub_order_id: order.sub_order_id,
          shipment: order.shipment
        };
      });

      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) =>
    order.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full flex flex-col p-4 md:p-6 space-y-6">
        {/* Orders Section */}
        <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-800">Danh sách đơn hàng</h2>
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
                  onOrderUpdate={fetchOrders}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperOrders;