import { BarChart, ShoppingCart, Users, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 7000 },
  { name: "May", revenue: 6000 },
  { name: "Jun", revenue: 8000 },
];

const recentOrders = [
  { id: "#001", customer: "John Doe", amount: "$120", status: "Completed" },
  { id: "#002", customer: "Jane Smith", amount: "$90", status: "Pending" },
  { id: "#003", customer: "Alice Johnson", amount: "$250", status: "Shipped" },
];

const Dashboard = () => {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<DollarSign size={28} />} label="Total Revenue" value="$25,000" />
        <StatCard icon={<ShoppingCart size={28} />} label="Total Orders" value="320" />
        <StatCard icon={<Users size={28} />} label="Customers" value="1,200" />
      </div>

      {/* Biểu đồ doanh thu */}
      <div className="mt-8 bg-white p-5 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Revenue Chart</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Danh sách đơn hàng gần đây */}
      <div className="mt-8 bg-white p-5 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">{order.id}</td>
                <td className="p-3">{order.customer}</td>
                <td className="p-3">{order.amount}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.status === "Completed"
                        ? "bg-green-500 text-white"
                        : order.status === "Pending"
                        ? "bg-yellow-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white p-5 rounded-lg shadow-md flex items-center gap-4">
    <div className="p-3 bg-blue-500 text-white rounded-full">{icon}</div>
    <div>
      <p className="text-gray-500">{label}</p>
      <h4 className="text-xl font-bold">{value}</h4>
    </div>
  </div>
);

export default Dashboard;
