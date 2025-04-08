import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Store,
  Star,
  Package,
  Clock,
  Calendar,
  Users,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getShopById } from "../../../../redux/shopSlice";

const ShopInfo = () => {
  const dispatch = useDispatch();
  const { product } = useSelector((state) => state.products);
  const { selectedShop, loading, error } = useSelector((state) => state.shops);

  useEffect(() => {
    if (product?.shop_id) {
      dispatch(getShopById(product.shop_id));
    }
  }, [dispatch, product]);

  if (loading || !selectedShop) return <div>Loading shop info...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const {
    shop_id,
    shop_name,
    logo,
    rating,
    total_products,
    followers,
    created_at,
    status,
    User,
  } = selectedShop;

  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow-md border border-gray-100">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Left Section: Avatar, Name, Online Status, and Buttons */}
        <div className="flex items-center gap-4 lg:w-1/3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-red-500 p-0.5">
              <img
                src={
                  logo ||
                  "https://haycafe.vn/wp-content/uploads/2023/04/Hinh-anh-avatar-cute-TikTok.jpg"
                }
                alt="Shop Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800">{shop_name}</h3>
            <p className="text-xs text-gray-600 font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
              {status === "active" ? "Active" : "Inactive"}
            </p>
            <p className="text-xs text-gray-500 italic">
              Owner: {User?.username || "Unknown"}
            </p>
            <div className="flex gap-2 mt-2">
              <button className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition flex items-center gap-1 text-sm font-medium">
                <MessageCircle size={14} />
                Chat Now
              </button>
              <Link
                to={`/shop/${shop_id}`}
                className="px-3 py-1 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition flex items-center gap-1 text-sm font-medium"
              >
                <Store size={14} />
                View Shop
              </Link>
            </div>
          </div>
        </div>

        {/* Right Section: Shop Statistics */}
        <div className="bg-gray-50 p-3 rounded-lg grid grid-cols-3 gap-3 lg:w-2/3">
          <StatItem
            icon={<Star size={14} className="text-red-500" />}
            label="Rating"
            value={rating || "0"}
            color="red"
          />
          <StatItem
            icon={<Package size={14} className="text-blue-500" />}
            label="Products"
            value={total_products || "0"}
            color="blue"
          />
          <StatItem
            icon={<MessageCircle size={14} className="text-green-500" />}
            label="Response"
            value="100%"
            color="green"
          />
          <StatItem
            icon={<Clock size={14} className="text-yellow-500" />}
            label="Response Time"
            value="Within a few hours"
            color="yellow"
          />
          <StatItem
            icon={<Calendar size={14} className="text-purple-500" />}
            label="Joined"
            value={new Date(created_at).toLocaleDateString("en-GB")}
            color="purple"
          />
          <StatItem
            icon={<Users size={14} className="text-indigo-500" />}
            label="Followers"
            value={followers || "0"}
            color="indigo"
          />
        </div>
      </div>
    </div>
  );
};

// Small component to show each stat
const StatItem = ({ icon, label, value, color }) => (
  <div className="flex items-center gap-1.5">
    <div className={`p-1.5 bg-${color}-100 rounded-md`}>{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default ShopInfo;
