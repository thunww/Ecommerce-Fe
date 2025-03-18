import { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Package, DollarSign, Users, ShoppingCart } from "lucide-react";

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dữ liệu giả lập
    const mockData = {
      totalOrders: 1200,
      totalRevenue: 500000000, // 500 triệu
      totalCustomers: 850,
      totalProducts: 300,
      monthlyRevenue: [
        { month: "Jan", revenue: 50000000, orders: 120 },
        { month: "Feb", revenue: 45000000, orders: 110 },
        { month: "Mar", revenue: 70000000, orders: 150 },
        { month: "Apr", revenue: 65000000, orders: 140 },
        { month: "May", revenue: 80000000, orders: 160 },
        { month: "Jun", revenue: 90000000, orders: 180 },
      ],
    };

    setTimeout(() => {
      setStats(mockData);
      setLoading(false);
    }, 500); // Giả lập delay 0.5s
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">📊 Admin Overview</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading data...</p>
      ) : (
        <>
          {/* Thống kê tổng quan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Orders" value={stats.totalOrders} icon={<Package className="w-8 h-8 text-indigo-600" />} />
            <StatCard title="Total Revenue" value={`₫${stats.totalRevenue.toLocaleString()}`} icon={<DollarSign className="w-8 h-8 text-emerald-600" />} />
            <StatCard title="Total Customers" value={stats.totalCustomers} icon={<Users className="w-8 h-8 text-amber-600" />} />
            <StatCard title="Total Products" value={stats.totalProducts} icon={<ShoppingCart className="w-8 h-8 text-gray-600" />} />
          </div>

          {/* Biểu đồ doanh thu & đơn hàng */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <ChartCard title="Monthly Revenue">
              <BarChartComponent data={stats.monthlyRevenue} />
            </ChartCard>
            <ChartCard title="Monthly Orders">
              <LineChartComponent data={stats.monthlyRevenue} />
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="p-5 rounded-lg shadow-md bg-white flex items-center space-x-4 border border-gray-200">
    {icon}
    <div>
      <h3 className="text-gray-600 text-lg font-medium">{title}</h3>
      <p className="text-xl font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
    <h3 className="text-lg font-medium text-gray-700 mb-4">{title}</h3>
    <ResponsiveContainer width="100%" height={300}>
      {children}
    </ResponsiveContainer>
  </div>
);

const BarChartComponent = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-gray-500 text-center">No data available</p>;
  }

  return (
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis tickFormatter={(value) => `${(value / 1_000_000).toFixed(1)}M`} />
      <Tooltip formatter={(value) => `₫${value.toLocaleString()}`} />
      <Legend />
      <Bar dataKey="revenue" fill="#6366F1" />
    </BarChart>
  );
};


const LineChartComponent = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-gray-500 text-center">No data available</p>;
  }

  return (
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="orders" stroke="#EAB308" strokeWidth={3} />
    </LineChart>
  );
};


export default AdminOverview;
