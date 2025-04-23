import React from 'react';
import { FaBox, FaCheckCircle, FaClock, FaMoneyBillWave } from 'react-icons/fa';

// Component hiển thị từng thẻ thống kê
const StatsCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
      <Icon className="text-white text-xl" />
    </div>
    <div className="ml-4 flex-1 min-w-0">
      <p className="text-sm text-gray-500 truncate">{title}</p>
      <p className="text-xl font-semibold text-gray-900 truncate">{value}</p>
    </div>
  </div>
);

// Hàm định dạng tiền tệ
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};

// Component chính hiển thị bảng thống kê
const ShipperStatsCards = ({ stats }) => {
  const statsData = [
    {
      title: 'Đơn hàng hôm nay',
      value: stats.todayOrders,
      icon: FaBox,
      color: 'bg-blue-500'
    },
    {
      title: 'Đã giao thành công',
      value: stats.completedOrders,
      icon: FaCheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Đang chờ giao',
      value: stats.pendingOrders,
      icon: FaClock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Tổng doanh thu hôm nay',
      value: stats.todayRevenue,
      icon: FaMoneyBillWave,
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {statsData.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default ShipperStatsCards;
