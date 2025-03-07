import { BarChart, ShoppingCart, Users, DollarSign, TrendingUp, Package } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 7000 },
  { name: "May", revenue: 6000 },
  { name: "Jun", revenue: 8000 },
];

const bestSellingProducts = [
  { name: "Smartphone", sales: 120, growth: "+15%" },
  { name: "Laptop", sales: 95, growth: "+10%" },
  { name: "Headphones", sales: 80, growth: "+8%" },
];

const userActivities = [
  { user: "John Doe", action: "purchased a Laptop", time: "5 mins ago", avatar: "https://i.pravatar.cc/40?img=1" },
  { user: "Jane Smith", action: "left a review", time: "10 mins ago", avatar: "https://i.pravatar.cc/40?img=2" },
  { user: "Alice Johnson", action: "added a Smartphone to cart", time: "15 mins ago", avatar: "https://i.pravatar.cc/40?img=3" },
];

const stockLevels = [
  { product: "Smartphone", stock: 50 },
  { product: "Laptop", stock: 30 },
  { product: "Headphones", stock: 75 },
];

const Dashboard = () => {
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard icon={<DollarSign size={28} />} label="Total Revenue" value="$25,000" />
        <StatCard icon={<ShoppingCart size={28} />} label="Total Orders" value="320" />
        <StatCard icon={<Users size={28} />} label="Customers" value="1,200" />
        <StatCard icon={<TrendingUp size={28} />} label="Conversion Rate" value="4.5%" />
      </div>

      <div className="mt-6 md:mt-8 bg-white p-4 md:p-5 rounded-lg shadow-md w-full">
        <h3 className="text-lg font-semibold mb-3 md:mb-4">Revenue Chart</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-4 md:p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3">Best Selling Products</h3>
          <ul>
            {bestSellingProducts.map((product, index) => (
              <li key={index} className="flex justify-between items-center py-2 border-b last:border-none hover:bg-gray-100 p-2 rounded-lg transition">
                <span>{product.name}</span>
                <div className="text-right">
                  <span className="font-semibold block">{product.sales} sales</span>
                  <span className="text-green-500 text-sm">{product.growth}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 md:p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3">Recent User Activities</h3>
          <ul>
            {userActivities.map((activity, index) => (
              <li key={index} className="flex items-center gap-3 py-2 border-b last:border-none hover:bg-gray-100 p-2 rounded-lg transition">
                <img src={activity.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                <div>
                  <span className="font-semibold">{activity.user}</span> {activity.action}
                  <span className="text-gray-500 text-xs block">{activity.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 md:mt-8 bg-white p-4 md:p-5 rounded-lg shadow-md w-full">
        <h3 className="text-lg font-semibold mb-3">Stock Levels</h3>
        <ul>
          {stockLevels.map((stock, index) => (
            <li key={index} className="flex justify-between py-2 border-b last:border-none">
              <span>{stock.product}</span>
              <span className={`font-semibold ${stock.stock < 40 ? "text-red-500" : "text-green-500"}`}>
                {stock.stock} in stock
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white p-4 md:p-5 rounded-lg shadow-md flex items-center gap-4">
    <div className="p-2 md:p-3 bg-blue-500 text-white rounded-full">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm md:text-base">{label}</p>
      <h4 className="text-lg md:text-xl font-bold">{value}</h4>
    </div>
  </div>
);

export default Dashboard;