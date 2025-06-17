import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailedIncome, getStatistics } from '../../redux/shipperSlice';
import { toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const ShipperIncome = () => {
  const dispatch = useDispatch();
  const { detailedIncome, statistics, loading, error } = useSelector((state) => state.shipper);
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  // State cho dữ liệu biểu đồ
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchIncomeData();
  }, [dateRange]);

  useEffect(() => {
    if (detailedIncome?.orders) {
      console.log("=== DEBUG: Orders data from API ===");
      console.log("detailedIncome:", detailedIncome);
      console.log("Orders array:", detailedIncome.orders);
      console.log("First order sample:", detailedIncome.orders[0]);
      console.log("Delivery time of first order:", detailedIncome.orders[0]?.deliveryTime);
      console.log("=== END DEBUG ===");
      processChartData();
    }
  }, [detailedIncome]);

  const processChartData = () => {
    if (!detailedIncome?.orders) return;

    // Nhóm dữ liệu theo ngày
    const dailyData = {};
    
    detailedIncome.orders.forEach(order => {
      if (order.deliveryTime) {
        const date = format(new Date(order.deliveryTime), 'yyyy-MM-dd');
        if (!dailyData[date]) {
          dailyData[date] = {
            date: format(new Date(order.deliveryTime), 'dd/MM'),
            income: 0,
            orders: 0
          };
        }
        dailyData[date].income += order.amount || 0;
        dailyData[date].orders += 1;
      }
    });

    // Chuyển đổi thành mảng và sắp xếp theo ngày
    const sortedData = Object.values(dailyData).sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateA - dateB;
    });

    setChartData(sortedData);
  };

  const fetchIncomeData = async () => {
    try {
      await dispatch(getDetailedIncome({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      })).unwrap();
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi tải dữ liệu thu nhập');
    }
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
    if (!dateTimeStr) return 'Chưa cập nhật';
    try {
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) return 'Ngày không hợp lệ';
      return format(date, 'HH:mm - dd/MM/yyyy', { locale: vi });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Ngày không hợp lệ';
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

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
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(statistics?.totalIncome || 0)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-lg font-semibold text-gray-700">Số đơn hàng</h4>
              <p className="text-2xl font-bold text-red-600">
                {statistics?.totalOrders || 0} đơn
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-lg font-semibold text-gray-700">Trung bình/đơn</h4>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(statistics?.averagePerOrder || 0)}
              </p>
            </div>
          </div>

          {/* Biểu đồ thu nhập */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Biểu đồ thu nhập theo ngày</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Biểu đồ đường */}
              <div>
                <h5 className="text-md font-medium text-gray-600 mb-3">Thu nhập theo thời gian</h5>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value), 'Thu nhập']}
                        labelFormatter={(label) => `Ngày: ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="income" 
                        stroke="#dc2626" 
                        strokeWidth={2}
                        dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Biểu đồ cột */}
              <div>
                <h5 className="text-md font-medium text-gray-600 mb-3">Số đơn hàng theo ngày</h5>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        allowDecimals={false}
                      />
                      <Tooltip 
                        formatter={(value) => [value, 'Số đơn hàng']}
                        labelFormatter={(label) => `Ngày: ${label}`}
                      />
                      <Bar 
                        dataKey="orders" 
                        fill="#dc2626" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {chartData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Không có dữ liệu để hiển thị biểu đồ
              </div>
            )}
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
                  {detailedIncome?.orders?.map((order, index) => (
                    <tr key={order.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Link 
                          to={`/shipper/orders/${order.id}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {order.id || 'N/A'}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateTime(order.deliveryTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.customerName || 'Không có tên'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {order.address || 'Không có địa chỉ'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.paymentMethod || 'COD'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                        {formatCurrency(order.amount || 0)}
                      </td>
                    </tr>
                  ))}
                  {(!detailedIncome?.orders || detailedIncome.orders.length === 0) && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
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