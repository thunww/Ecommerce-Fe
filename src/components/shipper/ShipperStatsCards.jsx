import React from 'react';

// Component hiển thị từng thẻ thống kê
const StatCard = ({ title, value, bgColor = "bg-white" }) => {
  return (
    <div className={`${bgColor} rounded-lg shadow-md p-4 text-center transform transition-transform duration-300 hover:scale-105`}>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-semibold text-gray-700">{value}</p>
    </div>
  );
};

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
    { title: "Đơn hàng hôm nay", value: (stats?.totalOrders ?? 0) + 2, bgColor: "bg-blue-50" },
    { title: "Đã giao thành công", value: (stats?.completedOrders ?? 0) + 2, bgColor: "bg-green-50" },
    { title: "Đang chờ giao", value: (stats?.pendingOrders ?? 0) + 2, bgColor: "bg-yellow-50" },
    { title: "Tổng doanh thu hôm nay", value: formatCurrency((stats?.totalRevenue ?? 0) + 2), bgColor: "bg-purple-50" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat, index) => (
        <StatCard key={index} title={stat.title} value={stat.value} bgColor={stat.bgColor} />
      ))}
    </div>
  );
};

export default ShipperStatsCards;
