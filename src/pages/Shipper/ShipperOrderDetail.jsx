import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUser, FaPhone, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaBox, FaTruck, FaCheckCircle } from 'react-icons/fa';

const ShipperOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState({
    id: id,
    customerName: "Nguyễn Văn A",
    phone: "0901234567",
    address: "123 Nguyễn Văn Cừ, Phường 4, Quận 5, TP.HCM",
    time: "10:30 AM - 20/03/2024",
    total: "150.000 đ",
    status: "accepted", // pending, accepted, completed
    paymentMethod: "Tiền mặt",
    note: "Gọi điện trước khi giao 15 phút",
    items: [
      {
        id: 1,
        name: "Cơm sườn bì chả",
        quantity: 2,
        price: "45.000 đ",
        total: "90.000 đ"
      },
      {
        id: 2,
        name: "Coca Cola",
        quantity: 2,
        price: "15.000 đ",
        total: "30.000 đ"
      },
      {
        id: 3,
        name: "Trà sữa trân châu",
        quantity: 2,
        price: "15.000 đ",
        total: "30.000 đ"
      }
    ],
    timeline: [
      {
        time: "10:15 AM",
        status: "Đơn hàng được tạo",
        description: "Khách hàng đặt đơn hàng"
      },
      {
        time: "10:20 AM",
        status: "Nhà hàng xác nhận",
        description: "Đơn hàng đã được nhà hàng xác nhận"
      },
      {
        time: "10:30 AM",
        status: "Tìm shipper",
        description: "Hệ thống đang tìm shipper"
      }
    ]
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ nhận";
      case "accepted":
        return "Đang giao";
      case "completed":
        return "Đã giao";
      default:
        return "Không xác định";
    }
  };

  const handleAcceptOrder = () => {
    setOrder(prev => ({
      ...prev,
      status: "accepted",
      timeline: [
        ...prev.timeline,
        {
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          status: "Shipper nhận đơn",
          description: "Đơn hàng đã được shipper nhận"
        }
      ]
    }));
  };

  const handleCompleteOrder = () => {
    setOrder(prev => ({
      ...prev,
      status: "completed",
      timeline: [
        ...prev.timeline,
        {
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          status: "Đã giao hàng",
          description: "Đơn hàng đã được giao thành công"
        }
      ]
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => navigate('/shipper/orders')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Quay lại
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thông tin đơn hàng và khách hàng */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thông tin khách hàng */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông tin khách hàng</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <FaUser className="text-gray-400 mr-3" />
                <span className="text-gray-600">{order.customerName}</span>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-gray-400 mr-3" />
                <span className="text-gray-600">{order.phone}</span>
              </div>
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-gray-400 mr-3 mt-1" />
                <span className="text-gray-600">{order.address}</span>
              </div>
              <div className="flex items-center">
                <FaClock className="text-gray-400 mr-3" />
                <span className="text-gray-600">{order.time}</span>
              </div>
            </div>
          </div>

          {/* Chi tiết đơn hàng */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Chi tiết đơn hàng</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 text-gray-600">Sản phẩm</th>
                    <th className="text-center py-3 text-gray-600">Số lượng</th>
                    <th className="text-right py-3 text-gray-600">Đơn giá</th>
                    <th className="text-right py-3 text-gray-600">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-3 text-gray-800">{item.name}</td>
                      <td className="py-3 text-center text-gray-800">{item.quantity}</td>
                      <td className="py-3 text-right text-gray-800">{item.price}</td>
                      <td className="py-3 text-right text-gray-800">{item.total}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="py-3 text-right font-semibold">Tổng cộng:</td>
                    <td className="py-3 text-right font-semibold text-red-600">{order.total}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Ghi chú */}
          {order.note && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Ghi chú</h2>
              <p className="text-gray-600">{order.note}</p>
            </div>
          )}
        </div>

        {/* Trạng thái và Timeline */}
        <div className="space-y-6">
          {/* Trạng thái và actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Trạng thái</h2>
            <div className="mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <FaMoneyBillWave className="text-gray-400 mr-3" />
                <span className="text-gray-600">Thanh toán: {order.paymentMethod}</span>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {order.status === "pending" && (
                <button
                  onClick={handleAcceptOrder}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Nhận đơn
                </button>
              )}
              {order.status === "accepted" && (
                <button
                  onClick={handleCompleteOrder}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  Đánh dấu đã giao
                </button>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Theo dõi đơn hàng</h2>
            <div className="space-y-4">
              {order.timeline.map((event, index) => (
                <div key={index} className="relative pl-6 pb-4 border-l border-gray-200 last:pb-0">
                  <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-500"></div>
                  <div className="text-sm text-gray-500">{event.time}</div>
                  <div className="font-medium text-gray-800">{event.status}</div>
                  <div className="text-sm text-gray-600">{event.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperOrderDetail;
