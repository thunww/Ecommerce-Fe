import React, { useState, useEffect } from "react";
import { Card } from "./Card";
import shopApi from "../../../api/VendorAPI/shopApi";
import { FaStar } from "react-icons/fa";

const SellerPerformance = () => {
  const [shopData, setShopData] = useState({
    rating: 4.9,
    totalReviews: 120,
    responseRate: 98,
    loading: true,
    error: null
  });

  // Tính toán rank dựa trên rating
  const calculateRank = (rating) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4.0) return 'Good';
    return 'Normal';
  };

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        console.log('Đang lấy dữ liệu shop...');
        
        // Cập nhật trạng thái loading
        setShopData(prev => ({
          ...prev,
          loading: true,
          error: null
        }));
        
        // Gọi API lấy thông tin shop
        console.log('Gọi shopApi.getShopInfo()...');
        const response = await shopApi.getShopInfo();
        console.log('API response:', response);
        console.log('Shop data:', response.data);
        
        // Sử dụng thông tin shop từ API
        const shopInfo = response.data;
        
        // Kiểm tra xem có dữ liệu rating không
        if (!shopInfo || shopInfo.rating === undefined) {
          console.log('Không tìm thấy rating từ API, sử dụng dữ liệu mẫu');
          // Giữ nguyên dữ liệu mẫu và cập nhật trạng thái loading
          setShopData(prev => ({
            ...prev,
            loading: false
          }));
          return;
        }
        
        // Kiểm tra kiểu dữ liệu
        console.log('Shop rating:', shopInfo.rating, 'Type:', typeof shopInfo.rating);
        
        // Format dữ liệu
        const formattedRating = parseFloat(shopInfo.rating) || 0;
        console.log('Formatted rating:', formattedRating);
        
        // Cập nhật state với dữ liệu từ API
        setShopData({
          rating: formattedRating,
          totalReviews: shopInfo.totalReviews || 120,
          responseRate: shopInfo.responseRate || 98,
          loading: false,
          error: null
        });
        
        console.log('ShopData đã được cập nhật:', {
          rating: formattedRating,
          totalReviews: shopInfo.totalReviews || 120,
          responseRate: shopInfo.responseRate || 98
        });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu shop:", error);
        console.error("Chi tiết lỗi:", error.response || error.message);
        
        // Giữ nguyên dữ liệu mẫu khi có lỗi
        console.log('Sử dụng dữ liệu mẫu do lỗi API');
        setShopData(prev => ({
          ...prev,
          loading: false
        }));
      }
    };

    fetchShopData();
  }, []);

  // Lấy màu cho rank
  const getRankColor = (rank) => {
    const colors = {
      'Excellent': 'text-green-600',
      'Good': 'text-blue-600',
      'Normal': 'text-yellow-600'
    };
    return colors[rank] || 'text-gray-600';
  };

  // Tính toán rank dựa vào rating hiện tại
  const rank = calculateRank(shopData.rating);
  
  // Log debug
  console.log('Rendering SellerPerformance với:', {
    rating: shopData.rating,
    rank,
    loading: shopData.loading,
    error: shopData.error
  });

  // Render sao (stars)
  const renderStars = (rating) => {
    return (
      <div className="flex items-center ml-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <div className="border-b pb-2 mb-2 font-bold text-lg">Seller Efficiency</div>
      <div className="p-2 space-y-2 text-gray-700">
        <div className="flex justify-between">
          <span>Rank:</span>
          {shopData.loading ? (
            <div className="animate-pulse h-4 w-32 bg-gray-200 rounded"></div>
          ) : shopData.error ? (
            <span className="text-red-500 text-sm">{shopData.error}</span>
          ) : (
            <span className={`font-semibold ${getRankColor(rank)}`}>
              {rank}
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <span>Average rating:</span>
          {shopData.loading ? (
            <div className="animate-pulse h-4 w-32 bg-gray-200 rounded"></div>
          ) : shopData.error ? (
            <span className="text-red-500 text-sm">{shopData.error}</span>
          ) : (
            <div className="flex items-center">
              <span className="font-semibold">
                {shopData.rating.toFixed(1)}/5
              </span>
              {renderStars(shopData.rating)}
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <span>Response rating:</span>
          {shopData.loading ? (
            <div className="animate-pulse h-4 w-32 bg-gray-200 rounded"></div>
          ) : shopData.error ? (
            <span className="text-red-500 text-sm">{shopData.error}</span>
          ) : (
            <span className="font-semibold">
              {shopData.responseRate}%
            </span>
          )}
        </div>

        <div className="text-blue-500 cursor-pointer hover:underline">
          View Details
        </div>
      </div>
    </Card>
  );
};

export default SellerPerformance;
