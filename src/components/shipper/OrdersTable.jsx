import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const OrdersTable = ({ orders, onOrderUpdate }) => {
  const handleAcceptOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Vui lòng đăng nhập lại');
        return;
      }

      const API_URL = 'http://localhost:8080';
      const response = await axios.post(
        `${API_URL}/api/v1/shippers/sub_orders/${orderId}/accept`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Nhận đơn hàng thành công');
        if (onOrderUpdate) onOrderUpdate();
      }
    } catch (error) {
      console.error('Error accepting order:', error);
      toast.error(error.response?.data?.message || 'Không thể nhận đơn hàng');
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Vui lòng đăng nhập lại');
        return;
      }

      const API_URL = 'http://localhost:8080';
      const response = await axios.post(
        `${API_URL}/api/v1/shippers/sub_orders/${orderId}/complete`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Hoàn thành đơn hàng thành công');
        if (onOrderUpdate) onOrderUpdate();
      }
    } catch (error) {
      console.error('Error completing order:', error);
      toast.error(error.response?.data?.message || 'Không thể hoàn thành đơn hàng');
    }
  };

  const renderActionButtons = (order) => {
    if (order.rawStatus === 'processing') {
      return (
        <button
          onClick={() => handleAcceptOrder(order.sub_order_id)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
        >
          Nhận đơn
        </button>
      );
    } else if (order.rawStatus === 'shipped') {
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
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {orders.map((order) => (
          <tr key={order.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <Link 
                to={`/shipper/orders/${order.id}`}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {order.id}
              </Link>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">
                    {order.customerName !== 'Không xác định' ? 
                      order.customerName.charAt(0).toUpperCase() : 'K'}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {order.customerName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.customerPhone}
                  </div>
                  {order.customerEmail && (
                    <div className="text-xs text-gray-400">
                      {order.customerEmail}
                    </div>
                  )}
                </div>
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-gray-500">{order.address}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div>{order.time}</div>
              {order.deliveredTime && (
                <div className="text-green-600 text-xs mt-1">
                  Hoàn thành: {order.deliveredTime}
                </div>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.total}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${order.rawStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' : 
                  order.rawStatus === 'shipped' ? 'bg-blue-100 text-blue-800' : 
                  order.rawStatus === 'delivered' ? 'bg-green-100 text-green-800' : 
                  'bg-gray-100 text-gray-800'}`}>
                {order.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              {renderActionButtons(order)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrdersTable;
