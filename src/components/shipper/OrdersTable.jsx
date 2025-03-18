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
const OrdersTable = ({ orders = [] }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-700">Danh sách đơn hàng</h2>
      </div>

      <div className="overflow-x-auto">
        {orders.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Mã đơn", "Người nhận", "Địa chỉ", "Giá trị", "Thời gian", "Trạng thái", "Hành động"].map((header, index) => (
                  <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{order.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(order.amount)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link to={`/shipper/orders/${order.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                      Chi tiết
                    </Link>
                    <button className="text-blue-600 hover:text-blue-900">
                      {order.status === 'pending' ? 'Giao hàng' :
                       order.status === 'transit' ? 'Hoàn thành' : ''}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500">Không có đơn hàng nào.</div>
        )}
      </div>
    </div>
  );
};

export default OrdersTable;
