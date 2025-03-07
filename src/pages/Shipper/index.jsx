import React, { useState } from 'react';

const ShipperProfilePage = () => {
  const [activeTab, setActiveTab] = useState('reviews');
  
  // Dữ liệu mẫu cho shipper
  const shipperData = {
    id: "SP10023",
    name: "Nguyễn Văn Anh",
    avatar: "/api/placeholder/150/150",
    phone: "0912.345.678",
    email: "vananh@shiperpro.vn",
    joinDate: "15/06/2023",
    rating: 4.7,
    totalDeliveries: 1286,
    completionRate: 98,
    onTimeRate: 96,
    area: "Quận 1, Quận 3, Quận 10",
    availability: "Online",
    verificationStatus: "Đã xác minh",
    vehicle: "Honda Wave",
    licensePlate: "59P1-23456"
  };
  
  // Dữ liệu mẫu cho đánh giá
  const reviews = [
    {
      id: 1,
      orderID: "ORD00893",
      customerName: "Trần Thị Bình",
      customerAvatar: "/api/placeholder/40/40",
      rating: 5,
      comment: "Shipper rất thân thiện và giao hàng cực nhanh. Đóng gói cẩn thận, không bị hư hỏng gì cả.",
      date: "05/03/2025",
      time: "14:30"
    },
    {
      id: 2,
      orderID: "ORD00725",
      customerName: "Lê Văn Cường",
      customerAvatar: "/api/placeholder/40/40",
      rating: 5,
      comment: "Shipper đúng giờ và rất lịch sự. Đã đợi tôi xuống lấy hàng mà không phàn nàn gì.",
      date: "02/03/2025",
      time: "10:15"
    },
    {
      id: 3,
      orderID: "ORD00684",
      customerName: "Phạm Thị Diễm",
      customerAvatar: "/api/placeholder/40/40",
      rating: 4,
      comment: "Giao hàng nhanh, nhưng không gọi trước khi đến như tôi dặn trong ghi chú.",
      date: "28/02/2025",
      time: "16:45"
    },
    {
      id: 4,
      orderID: "ORD00612",
      customerName: "Hoàng Văn Đức",
      customerAvatar: "/api/placeholder/40/40",
      rating: 3,
      comment: "Giao hàng hơi muộn so với thời gian dự kiến, nhưng shipper có thông báo trước và thái độ phục vụ tốt.",
      date: "25/02/2025",
      time: "09:20"
    },
    {
      id: 5,
      orderID: "ORD00589",
      customerName: "Nguyễn Thị Emmi",
      customerAvatar: "/api/placeholder/40/40",
      rating: 5,
      comment: "Tuyệt vời! Shipper nhiệt tình và thân thiện. Sẽ ủng hộ lần sau.",
      date: "22/02/2025",
      time: "13:10"
    }
  ];
  
  // Đếm số lượng đánh giá theo số sao
  const ratingCounts = {
    5: reviews.filter(review => review.rating === 5).length,
    4: reviews.filter(review => review.rating === 4).length,
    3: reviews.filter(review => review.rating === 3).length,
    2: reviews.filter(review => review.rating === 2).length,
    1: reviews.filter(review => review.rating === 1).length
  };
  
  // Component hiển thị số sao
  const RatingStars = ({ rating }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };
  
  // Component hiển thị thanh tiến trình đánh giá
  const RatingBar = ({ starCount, total, starNumber }) => {
    const percentage = total > 0 ? Math.round((starCount / total) * 100) : 0;
    
    return (
      <div className="flex items-center mt-1">
        <span className="text-sm font-medium w-6">{starNumber}</span>
        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
          <div 
            className="bg-yellow-400 h-2 rounded-full" 
            style={{ width: `${percentage}%` }} 
          ></div>
        </div>
        <span className="text-sm text-gray-600 w-10">{percentage}%</span>
      </div>
    );
  };
  
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row">
            {/* Thông tin shipper bên trái */}
            <div className="md:w-2/3 flex">
              <div className="mr-6">
                <img 
                  src={shipperData.avatar} 
                  alt={shipperData.name} 
                  className="w-24 h-24 rounded-full object-cover border-4 border-orange-500" 
                />
              </div>
              <div>
                <div className="flex items-center">
                  <h2 className="text-2xl font-bold">{shipperData.name}</h2>
                  {shipperData.verificationStatus === "Đã xác minh" && (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Đã xác minh
                    </span>
                  )}
                  <span className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${shipperData.availability === "Online" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                    {shipperData.availability}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">ID: {shipperData.id}</p>
                <div className="flex items-center mb-1">
                  <div className="flex items-center">
                    <span className="text-3xl font-bold mr-2">{shipperData.rating}</span>
                    <RatingStars rating={Math.round(shipperData.rating)} />
                  </div>
                  <span className="ml-2 text-gray-600">({reviews.length} đánh giá)</span>
                </div>
                <div className="flex flex-wrap text-sm text-gray-600 mt-3">
                  <div className="mr-6 mb-2">
                    <span className="font-medium">Tổng đơn hàng:</span> {shipperData.totalDeliveries}
                  </div>
                  <div className="mr-6 mb-2">
                    <span className="font-medium">Tỷ lệ hoàn thành:</span> {shipperData.completionRate}%
                  </div>
                  <div className="mr-6 mb-2">
                    <span className="font-medium">Tỷ lệ đúng giờ:</span> {shipperData.onTimeRate}%
                  </div>
                </div>
              </div>
            </div>
            {/* Thông tin liên hệ bên phải */}
            <div className="md:w-1/3 md:border-l md:pl-6 mt-4 md:mt-0">
              <h3 className="font-medium text-gray-900 mb-3">Thông tin liên hệ</h3>
              <div className="text-sm text-gray-600">
                <div className="flex items-center mb-2">
                  <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {shipperData.phone}
                </div>
                <div className="flex items-center mb-2">
                  <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {shipperData.email}
                </div>
                <div className="flex items-center mb-2">
                  <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Khu vực: {shipperData.area}
                </div>
                <div className="flex items-center mb-2">
                  <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Đã tham gia: {shipperData.joinDate}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {shipperData.vehicle} - {shipperData.licensePlate}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button 
              className={`px-6 py-3 font-medium relative ${activeTab === 'reviews' ? 'text-orange-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('reviews')}
            >
              Đánh giá
              {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"></div>}
            </button>
            <button 
              className={`px-6 py-3 font-medium relative ${activeTab === 'statistics' ? 'text-orange-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('statistics')}
            >
              Thống kê
              {activeTab === 'statistics' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"></div>}
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'reviews' ? (
              <div>
                {/* Thống kê đánh giá */}
                <div className="flex flex-col md:flex-row mb-8 p-4 bg-gray-50 rounded-lg">
                  <div className="md:w-1/3 mb-4 md:mb-0">
                    <h3 className="text-lg font-medium mb-2">Phản hồi của khách hàng</h3>
                    <div className="flex items-baseline">
                      <span className="text-5xl font-bold text-gray-900">{shipperData.rating}</span>
                      <span className="text-sm text-gray-600 ml-2">trên 5</span>
                    </div>
                    <div className="mt-2">
                      <RatingStars rating={Math.round(shipperData.rating)} />
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{reviews.length} đánh giá</div>
                  </div>
                  <div className="md:w-2/3">
                    <RatingBar starNumber={5} starCount={ratingCounts[5]} total={reviews.length} />
                    <RatingBar starNumber={4} starCount={ratingCounts[4]} total={reviews.length} />
                    <RatingBar starNumber={3} starCount={ratingCounts[3]} total={reviews.length} />
                    <RatingBar starNumber={2} starCount={ratingCounts[2]} total={reviews.length} />
                    <RatingBar starNumber={1} starCount={ratingCounts[1]} total={reviews.length} />
                  </div>
                </div>
                
                {/* Danh sách đánh giá */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Tất cả đánh giá</h3>
                  {reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
                      <div className="flex items-start">
                        <img 
                          src={review.customerAvatar} 
                          alt={review.customerName} 
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium">{review.customerName}</h4>
                              <div className="flex items-center text-sm text-gray-500">
                                <span className="mr-2">Đơn hàng: {review.orderID}</span>
                                <span>{review.date}</span>
                              </div>
                            </div>
                            <div>
                              <RatingStars rating={review.rating} />
                            </div>
                          </div>
                          <p className="mt-2 text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {/* Thống kê hiệu suất */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white shadow">
                    <div className="text-sm opacity-80 mb-1">Tỷ lệ hoàn thành</div>
                    <div className="text-3xl font-bold">{shipperData.completionRate}%</div>
                    <div className="mt-2 bg-white bg-opacity-20 h-2 rounded-full">
                      <div className="bg-white h-2 rounded-full" style={{ width: `${shipperData.completionRate}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow">
                    <div className="text-sm opacity-80 mb-1">Tỷ lệ đúng giờ</div>
                    <div className="text-3xl font-bold">{shipperData.onTimeRate}%</div>
                    <div className="mt-2 bg-white bg-opacity-20 h-2 rounded-full">
                      <div className="bg-white h-2 rounded-full" style={{ width: `${shipperData.onTimeRate}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white shadow">
                    <div className="text-sm opacity-80 mb-1">Tổng đơn hàng</div>
                    <div className="text-3xl font-bold">{shipperData.totalDeliveries}</div>
                    <div className="mt-2 text-sm">Đã giao thành công</div>
                  </div>
                </div>
                
                {/* Một số thống kê bổ sung */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Thống kê chi tiết</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Đơn hàng theo thời gian</h4>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span>Buổi sáng (6:00 - 12:00)</span>
                        <span className="font-medium">35%</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span>Buổi chiều (12:00 - 18:00)</span>
                        <span className="font-medium">48%</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span>Buổi tối (18:00 - 22:00)</span>
                        <span className="font-medium">17%</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Đơn hàng theo khu vực</h4>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span>Quận 1</span>
                        <span className="font-medium">42%</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span>Quận 3</span>
                        <span className="font-medium">35%</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span>Quận 10</span>
                        <span className="font-medium">23%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperProfilePage;