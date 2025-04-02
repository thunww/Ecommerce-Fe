import React, { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Link } from 'react-router-dom';

const ShipperIncome = () => {
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });
  
  // Mock data - sẽ được thay thế bằng dữ liệu thực từ API
  const mockData = {
    total: 250000,
    orders: 10,
    details: [
      {
        id: "DH001",
        deliveryTime: "2024-03-15 08:30",
        customerName: "Nguyễn Văn A",
        address: "123 Nguyễn Văn Linh, Q.7, TP.HCM",
        amount: 50000,
        status: "Đã giao",
        paymentMethod: "Tiền mặt"
      },
      {
        id: "DH002",
        deliveryTime: "2024-03-15 09:15",
        customerName: "Trần Thị B",
        address: "456 Lê Văn Việt, Q.9, TP.HCM",
        amount: 75000,
        status: "Đã giao",
        paymentMethod: "Ví điện tử"
      },
      {
        id: "DH003",
        deliveryTime: "2024-03-15 14:20",
        customerName: "Phạm Văn C",
        address: "789 Võ Văn Tần, Q.3, TP.HCM",
        amount: 75000,
        status: "Đã giao",
        paymentMethod: "Tiền mặt"
      },
      {
        id: "DH004",
        deliveryTime: "2024-03-15 16:45",
        customerName: "Lê Thị D",
        address: "321 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM",
        amount: 50000,
        status: "Đã giao",
        paymentMethod: "Chuyển khoản"
      }
    ]
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return format(date, 'HH:mm - dd/MM/yyyy', { locale: vi });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Thống kê thu nhập
          </h2>
          <div className="flex items-center space-x-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Từ ngày
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
                className="mt-1 block w-full rounded-md border-2 border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500 px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                Đến ngày
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                className="mt-1 block w-full rounded-md border-2 border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500 px-3 py-2"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-lg font-semibold text-gray-700">Tổng thu nhập</h4>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(mockData.total)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-lg font-semibold text-gray-700">Số đơn hàng</h4>
              <p className="text-2xl font-bold text-red-600">{mockData.orders} đơn</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-lg font-semibold text-gray-700">Trung bình/đơn</h4>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(mockData.total / mockData.orders)}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Đơn hàng đã giao</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã đơn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian giao
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Địa chỉ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thanh toán
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số tiền
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockData.details.map((order, index) => (
                    <tr key={order.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Link 
                          to={`/shipper/orders/${order.id}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {order.id}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateTime(order.deliveryTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {order.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                        {formatCurrency(order.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperIncome; 