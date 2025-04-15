import React from 'react';
import { Link } from 'react-router-dom';

// Component định dạng tiền tệ
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};

// Component hiển thị trạng thái đơn hàng
const StatusBadge = ({ status }) => {
  const statusClasses = {
    pending: "bg-yellow-100 text-yellow-800",
    transit: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800"
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${statusClasses[status] || "bg-gray-100 text-gray-800"}`}>
      {status === 'pending' ? 'Chờ giao' :
       status === 'transit' ? 'Đang giao' :
       status === 'delivered' ? 'Đã giao' :
       status}
    </span>
  );
};

// Component chính hiển thị bảng đơn hàng
const OrdersTable = ({ orders, onOrderClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ nhận";
      case "accepted":
        return "Đang giao";
      case "completed":
        return "Đã giao";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  return (
    <div className="h-full">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Mã đơn
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Khách hàng
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Địa chỉ
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Thời gian
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Tổng tiền
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Trạng thái
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <Link
                    to={`/shipper/orders/${order.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {order.id}
                  </Link>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.customerName}</div>
                  <div className="text-sm text-gray-500">{order.phone}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-900 max-w-[200px] truncate">{order.address}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.time}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.total}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onOrderClick?.(order.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-4 py-3 text-center text-sm text-gray-500">
                Không có đơn hàng nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
