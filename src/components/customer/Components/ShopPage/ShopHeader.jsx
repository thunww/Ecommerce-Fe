import React from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Store,
  Heart,
  Star,
  Eye,
  MapPin,
  Calendar,
} from "lucide-react";

const ShopHeader = ({
  shopId,
  shopName,
  description,
  logo,
  banner,
  rating,
  followers,
  totalProducts,
  views,
  address,
  status,
  createdAt,
  username,
}) => {
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num?.toString() || "0";
  };

  return (
    <div className="bg-white">
      {/* Banner Section */}
      <div className="relative">
        <div className="w-full h-[200px] bg-gradient-to-r from-[#ee4d2d] to-[#ff6b35] overflow-hidden">
          <img
            src={banner || "https://via.placeholder.com/1200x200"}
            alt="Shop Banner"
            className="w-full h-full object-cover opacity-80"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentNode.style.background =
                "linear-gradient(135deg, #ee4d2d 0%, #ff6b35 100%)";
            }}
          />
        </div>

        {/* Shop Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          <div className="max-w-7xl mx-auto flex items-end gap-4">
            {/* Shop Logo */}
            <div className="relative">
              <img
                src={logo || "https://via.placeholder.com/100"}
                alt="Shop Logo"
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/100";
                }}
              />
              {status === "active" && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>

            {/* Shop Name & Info */}
            <div className="flex-1 text-white pb-2">
              <h1 className="text-2xl font-bold mb-1">{shopName}</h1>
              <div className="flex items-center gap-4 text-sm opacity-90">
                <span>@{username}</span>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>
                    Tham gia {new Date(createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                {status === "active" && (
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Đang hoạt động
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          {/* Left: Shop Stats */}
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="flex items-center justify-center mb-1">
                  <Heart size={16} className="text-[#ee4d2d]" />
                </div>
                <p className="text-sm font-bold text-[#ee4d2d]">
                  {formatNumber(followers)}
                </p>
                <p className="text-xs text-gray-600">Theo dõi</p>
              </div>

              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="flex items-center justify-center mb-1">
                  <Store size={16} className="text-orange-500" />
                </div>
                <p className="text-sm font-bold text-orange-500">
                  {formatNumber(totalProducts)}
                </p>
                <p className="text-xs text-gray-600">Sản phẩm</p>
              </div>

              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="flex items-center justify-center mb-1">
                  <Star size={16} className="text-yellow-500" />
                </div>
                <p className="text-sm font-bold text-yellow-500">
                  {rating || "5.0"}
                </p>
                <p className="text-xs text-gray-600">Đánh giá</p>
              </div>

              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="flex items-center justify-center mb-1">
                  <Eye size={16} className="text-blue-500" />
                </div>
                <p className="text-sm font-bold text-blue-500">
                  {formatNumber(views)}
                </p>
                <p className="text-xs text-gray-600">Lượt xem</p>
              </div>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="w-full lg:w-auto">
            <div className="flex flex-row lg:flex-col gap-2 lg:min-w-[200px]">
              <button className="flex-1 lg:w-full bg-[#ee4d2d] hover:bg-[#d94424] text-white py-2 px-4 rounded text-sm flex items-center justify-center gap-2 transition-colors">
                <MessageCircle size={16} />
                Chat Ngay
              </button>

              <button className="flex-1 lg:w-full border border-[#ee4d2d] text-[#ee4d2d] hover:bg-[#ee4d2d] hover:text-white py-2 px-4 rounded text-sm flex items-center justify-center gap-2 transition-colors">
                <Heart size={16} />
                Theo Dõi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHeader;
