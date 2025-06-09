import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Store,
  Star,
  Package,
  Clock,
  Calendar,
  Users,
  Heart,
  Eye,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getShopById } from "../../../../redux/shopSlice";
import ChatBox from "../../../../components/customer/Components/ChatBox";

const ShopInfoOfProduct = () => {
  const dispatch = useDispatch();
  const { product } = useSelector((state) => state.products);
  const { selectedShop, loading, error } = useSelector((state) => state.shops);

  const [showChat, setShowChat] = useState(false);

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
    views,
  } = selectedShop;

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num?.toString() || "0";
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to={`/shop/${shop_id}`} className="relative">
                <img
                  src={
                    logo ||
                    "https://haycafe.vn/wp-content/uploads/2023/04/Hinh-anh-avatar-cute-TikTok.jpg"
                  }
                  alt="Shop Avatar"
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#ee4d2d]"
                />
                {status === "active" && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </Link>

              <div>
                <h3 className="text-base font-semibold text-gray-800">
                  {shop_name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {status === "active" ? "Đang hoạt động" : "Tạm dừng"}
                  </span>
                  <span>•</span>
                  <span>@{User?.username || "unknown"}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowChat(true)}
                className="px-3 py-1.5 bg-[#ee4d2d] hover:bg-[#d94424] text-white rounded text-sm flex items-center gap-1 transition-colors"
              >
                <MessageCircle size={14} />
                Chat
              </button>
              <Link
                to={`/shop/${shop_id}`}
                className="px-3 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded text-sm flex items-center gap-1 transition-colors"
              >
                <Store size={14} />
                Xem Shop
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Heart size={16} className="text-[#ee4d2d]" />
              </div>
              <p className="text-sm font-bold text-[#ee4d2d]">
                {formatNumber(followers)}
              </p>
              <p className="text-xs text-gray-600">Theo dõi</p>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Package size={16} className="text-[#ee4d2d]" />
              </div>
              <p className="text-sm font-bold text-[#ee4d2d]">
                {formatNumber(total_products)}
              </p>
              <p className="text-xs text-gray-600">Sản phẩm</p>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Star size={16} className="text-[#ee4d2d]" />
              </div>
              <p className="text-sm font-bold text-[#ee4d2d]">
                {rating || "5.0"}
              </p>
              <p className="text-xs text-gray-600">Đánh giá</p>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Eye size={16} className="text-[#ee4d2d]" />
              </div>
              <p className="text-sm font-bold text-[#ee4d2d]">
                {formatNumber(views)}
              </p>
              <p className="text-xs text-gray-600">Lượt xem</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <MessageCircle size={14} className="text-[#ee4d2d]" />
                <span>
                  Tỷ lệ phản hồi:{" "}
                  <strong className="text-green-600">100%</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={14} className="text-[#ee4d2d]" />
                <span>
                  Phản hồi trong:{" "}
                  <strong className="text-green-600">vài giờ</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={14} className="text-[#ee4d2d]" />
                <span>
                  Tham gia:{" "}
                  <strong>
                    {new Date(created_at).toLocaleDateString("vi-VN")}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Box */}
      {showChat && (
        <ChatBox shopName={shop_name} onClose={() => setShowChat(false)} />
      )}
    </>
  );
};

export default ShopInfoOfProduct;
