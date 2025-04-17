import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaMoneyBill, FaTruck } from 'react-icons/fa';

const ShipperOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      toast.error('Không tìm thấy mã đơn hàng');
      navigate('/shipper/dashboard');
      return;
    }
    fetchOrderDetails();
  }, [orderId, navigate]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        toast.error('Vui lòng đăng nhập lại');
        return;
      }

      if (!orderId) {
        toast.error('Không tìm thấy mã đơn hàng');
        navigate('/shipper/dashboard');
        return;
      }

      const API_URL = 'http://localhost:8080';
      const response = await axios.get(
        `${API_URL}/api/v1/shippers/sub_orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setOrderDetails(response.data.data);
      } else {
        toast.error('Không tìm thấy thông tin đơn hàng');
        navigate('/shipper/dashboard');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error(error.response?.data?.message || 'Không thể tải thông tin đơn hàng');
      if (error.response?.status === 404) {
        navigate('/shipper/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptOrder = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Vui lòng đăng nhập lại');
        return;
      }

      const API_URL = 'http://localhost:8080';
      const response = await axios.post(
        `${API_URL}/api/v1/shippers/sub_orders/${orderId}/accept`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Nhận đơn hàng thành công');
        fetchOrderDetails(); // Refresh data
      }
    } catch (error) {
      console.error('Error accepting order:', error);
      toast.error(error.response?.data?.message || 'Không thể nhận đơn hàng');
    }
  };

  const handleCompleteOrder = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Vui lòng đăng nhập lại');
        return;
      }

      const API_URL = 'http://localhost:8080';
      const response = await axios.post(
        `${API_URL}/api/v1/shippers/sub_orders/${orderId}/complete`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Hoàn thành đơn hàng thành công');
        fetchOrderDetails(); // Refresh data
      }
    } catch (error) {
      console.error('Error completing order:', error);
      toast.error(error.response?.data?.message || 'Không thể hoàn thành đơn hàng');
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Không tìm thấy thông tin đơn hàng</h2>
        <Link
          to="/shipper/dashboard"
          className="text-red-600 hover:text-red-800 hover:underline"
        >
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  const { Order: order, status, shipping_fee, created_at, updated_at, shipment } = orderDetails;
  const { User: customer, shipping_address } = order;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/shipper/dashboard"
          className="text-red-600 hover:text-red-800 hover:underline flex items-center"
        >
          ← Quay lại trang chủ
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Chi tiết đơn hàng #{orderId}
            </h1>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(status)}`}>
              {getStatusText(status)}
            </span>
          </div>

          {/* Thông tin khách hàng */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin khách hàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <FaUser className="text-gray-400 mr-2" />
                <span className="text-gray-600">
                  {customer.first_name} {customer.last_name}
                </span>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-gray-400 mr-2" />
                <span className="text-gray-600">{customer.phone || 'Chưa cập nhật'}</span>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="text-gray-400 mr-2" />
                <span className="text-gray-600">{customer.email}</span>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-gray-400 mr-2" />
                <span className="text-gray-600">
                  {[
                    shipping_address.address_line,
                    shipping_address.city,
                    shipping_address.province,
                    shipping_address.postal_code
                  ].filter(Boolean).join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Thông tin đơn hàng */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin đơn hàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <FaClock className="text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Thời gian tạo</p>
                  <p className="text-gray-600">{formatDateTime(created_at)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaClock className="text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                  <p className="text-gray-600">{formatDateTime(updated_at)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaMoneyBill className="text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Phí vận chuyển</p>
                  <p className="text-gray-600">{formatCurrency(shipping_fee)}</p>
                </div>
              </div>
              {shipment && (
                <div className="flex items-center">
                  <FaTruck className="text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Ngày giao dự kiến</p>
                    <p className="text-gray-600">
                      {formatDateTime(shipment.estimated_delivery_date)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ghi chú */}
          {order.note && (
            <div className="bg-yellow-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Ghi chú</h2>
              <p className="text-gray-600">{order.note}</p>
            </div>
          )}

          {/* Nút thao tác */}
          <div className="flex justify-end gap-4">
            {status === 'processing' && (
              <button
                onClick={handleAcceptOrder}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Nhận đơn
              </button>
            )}
            {status === 'shipped' && (
              <button
                onClick={handleCompleteOrder}
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Hoàn thành
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperOrderDetail;
