import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');

const LoadingSpinner = () => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <div style={{ fontSize: '24px', color: '#1890ff' }}>Đang tải...</div>
  </div>
);

const ShipperOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [accepting, setAccepting] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`/api/v1/shippers/sub_orders/${orderId}`);
      if (response.data.success) {
        console.log('Order details:', response.data.data);
        setOrder(response.data.data);
      } else {
        console.error('Error:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async () => {
    try {
      setAccepting(true);
      const response = await axios.post(`/api/v1/shippers/sub_orders/${orderId}/accept`);
      if (response.data.success) {
        console.log('Nhận đơn hàng thành công');
        fetchOrderDetails();
      } else {
        console.error('Error:', response.data.message);
      }
    } catch (error) {
      console.error('Error accepting order:', error);
    } finally {
      setAccepting(false);
    }
  };

  const handleCompleteOrder = async () => {
    try {
      setAccepting(true);
      const response = await axios.put(`/api/v1/shippers/sub_orders/${orderId}/complete`);
      if (response.data.success) {
        console.log('Hoàn thành đơn hàng thành công');
        fetchOrderDetails();
      } else {
        console.error('Error:', response.data.message);
      }
    } catch (error) {
      console.error('Error completing order:', error);
    } finally {
      setAccepting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#faad14';
      case 'processing':
        return '#1890ff';
      case 'shipped':
        return '#1890ff';
      case 'delivered':
        return '#52c41a';
      case 'cancelled':
        return '#f5222d';
      default:
        return '#d9d9d9';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!order) {
    return (
      <div className="card" style={{ padding: '20px', margin: '20px', border: '1px solid #d9d9d9', borderRadius: '4px' }}>
        <p>Không tìm thấy thông tin đơn hàng</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <button 
        onClick={() => navigate(-1)}
        style={{ 
          marginBottom: '16px',
          padding: '8px 16px',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          background: '#fff',
          cursor: 'pointer'
        }}
      >
        Quay lại
      </button>

      <div className="card" style={{ padding: '20px', marginBottom: '20px', border: '1px solid #d9d9d9', borderRadius: '4px' }}>
        <h2 style={{ marginBottom: '20px' }}>Chi tiết đơn hàng</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <div style={{ width: '150px', fontWeight: 'bold' }}>Mã đơn hàng:</div>
            <div>{order.sub_order_id}</div>
          </div>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <div style={{ width: '150px', fontWeight: 'bold' }}>Trạng thái:</div>
            <div>
              <span style={{ 
                padding: '4px 8px', 
                borderRadius: '4px', 
                backgroundColor: getStatusColor(order.status),
                color: '#fff'
              }}>
                {getStatusText(order.status)}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <div style={{ width: '150px', fontWeight: 'bold' }}>Ngày tạo:</div>
            <div>{moment(order.created_at).format('DD/MM/YYYY HH:mm')}</div>
          </div>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <div style={{ width: '150px', fontWeight: 'bold' }}>Tổng tiền:</div>
            <div>{order.total_price.toLocaleString('vi-VN')}đ</div>
          </div>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <div style={{ width: '150px', fontWeight: 'bold' }}>Phí vận chuyển:</div>
            <div>{order.shipping_fee.toLocaleString('vi-VN')}đ</div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Thông tin người nhận</h3>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <div style={{ width: '150px', fontWeight: 'bold' }}>Họ tên:</div>
            <div>{order.Order?.User?.first_name} {order.Order?.User?.last_name}</div>
          </div>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <div style={{ width: '150px', fontWeight: 'bold' }}>Số điện thoại:</div>
            <div>{order.Order?.User?.phone}</div>
          </div>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <div style={{ width: '150px', fontWeight: 'bold' }}>Email:</div>
            <div>{order.Order?.User?.email}</div>
          </div>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <div style={{ width: '150px', fontWeight: 'bold' }}>Địa chỉ:</div>
            <div>
              {order.Order?.shipping_address?.address_line}, {order.Order?.shipping_address?.city}, {order.Order?.shipping_address?.province}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Danh sách sản phẩm</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px', border: '1px solid #d9d9d9', textAlign: 'left' }}>Sản phẩm</th>
                <th style={{ padding: '8px', border: '1px solid #d9d9d9', textAlign: 'center' }}>Số lượng</th>
                <th style={{ padding: '8px', border: '1px solid #d9d9d9', textAlign: 'right' }}>Đơn giá</th>
                <th style={{ padding: '8px', border: '1px solid #d9d9d9', textAlign: 'right' }}>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order?.orderItems?.map(item => {
                console.log('Order item:', item);
                return (
                  <tr key={item.order_item_id}>
                    <td style={{ padding: '8px', border: '1px solid #d9d9d9' }}>
                      <div>{item.product?.product_name}</div>
                      {item.productVariant && (
                        <div style={{ color: '#666', fontSize: '12px' }}>
                          {item.productVariant.size && `Size: ${item.productVariant.size} `}
                          {item.productVariant.color && `Màu: ${item.productVariant.color} `}
                          {item.productVariant.material && `Chất liệu: ${item.productVariant.material}`}
                          {item.productVariant.storage && `Bộ nhớ: ${item.productVariant.storage} `}
                          {item.productVariant.ram && `RAM: ${item.productVariant.ram} `}
                          {item.productVariant.processor && `CPU: ${item.productVariant.processor}`}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #d9d9d9', textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ padding: '8px', border: '1px solid #d9d9d9', textAlign: 'right' }}>{item.price.toLocaleString('vi-VN')}đ</td>
                    <td style={{ padding: '8px', border: '1px solid #d9d9d9', textAlign: 'right' }}>{item.total.toLocaleString('vi-VN')}đ</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {order.shipment && (
          <div style={{ marginBottom: '20px' }}>
            <h3>Thông tin vận chuyển</h3>
            <div style={{ display: 'flex', marginBottom: '10px' }}>
              <div style={{ width: '150px', fontWeight: 'bold' }}>Mã vận đơn:</div>
              <div>{order.shipment.tracking_number}</div>
            </div>
            <div style={{ display: 'flex', marginBottom: '10px' }}>
              <div style={{ width: '150px', fontWeight: 'bold' }}>Trạng thái:</div>
              <div>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  backgroundColor: getStatusColor(order.shipment.status),
                  color: '#fff'
                }}>
                  {getStatusText(order.shipment.status)}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', marginBottom: '10px' }}>
              <div style={{ width: '150px', fontWeight: 'bold' }}>Dự kiến giao:</div>
              <div>
                {order.shipment.estimated_delivery_date && 
                  moment(order.shipment.estimated_delivery_date).format('DD/MM/YYYY HH:mm')}
              </div>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          {order.status === 'processing' && (
            <button
              onClick={handleAcceptOrder}
              disabled={accepting}
              style={{ 
                padding: '8px 16px',
                border: '1px solid #1890ff',
                borderRadius: '4px',
                background: '#1890ff',
                color: '#fff',
                cursor: 'pointer',
                marginRight: '8px'
              }}
            >
              {accepting ? 'Đang xử lý...' : 'Nhận đơn hàng'}
            </button>
          )}
          {order.status === 'shipped' && (
            <button
              onClick={handleCompleteOrder}
              disabled={accepting}
              style={{ 
                padding: '8px 16px',
                border: '1px solid #1890ff',
                borderRadius: '4px',
                background: '#1890ff',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              {accepting ? 'Đang xử lý...' : 'Hoàn thành đơn hàng'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipperOrderDetail;
