import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ShipperLogo from '../../components/shipper/ShipperLogo';

const ShipperRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_type: '',
    license_plate: '',
    phone: ''
  });

  useEffect(() => {
    // Kiểm tra xác thực khi component mount
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.warning('Vui lòng đăng nhập để đăng ký làm shipper');
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  const vehicleTypes = [
    { value: 'motorcycle', label: 'Xe máy' },
    { value: 'bike', label: 'Xe đạp' },
    { value: 'car', label: 'Ô tô' },
    { value: 'truck', label: 'Xe tải' },
    { value: 'van', label: 'Xe tải nhỏ' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.vehicle_type) {
      errors.push('Vui lòng chọn loại phương tiện');
    }
    if (!formData.license_plate) {
      errors.push('Vui lòng nhập biển số xe');
    }
    if (!formData.phone) {
      errors.push('Vui lòng nhập số điện thoại');
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      errors.push('Số điện thoại không hợp lệ');
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.warning('Vui lòng đăng nhập để đăng ký làm shipper');
      navigate('/login');
      return;
    }

    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await axios.post('/api/v1/shippers/register', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        toast.success('Đăng ký shipper thành công. Vui lòng đợi admin xét duyệt.');
        // Chuyển về trang chủ thay vì dashboard
        navigate('/');
      } else {
        toast.error(response.data.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      console.error('Error registering shipper:', error);
      toast.error(error.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          maxWidth: '400px', 
          margin: '0 auto',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
          padding: '30px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <ShipperLogo width={80} height={80} />
          </div>
          <h2 style={{ 
            fontSize: '24px',
            fontWeight: 'bold',
            margin: '0 0 20px',
            color: '#333'
          }}>
            Vui lòng đăng nhập
          </h2>
          <p style={{ 
            margin: '0 0 30px',
            color: '#666'
          }}>
            Bạn cần đăng nhập để đăng ký làm shipper
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 2px 8px rgba(24,144,255,0.35)'
            }}
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          backgroundColor: '#1890ff',
          padding: '30px 20px',
          textAlign: 'center',
          color: '#fff'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <ShipperLogo width={80} height={80} />
          </div>
          <h2 style={{ 
            fontSize: '24px',
            fontWeight: 'bold',
            margin: '0',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Đăng ký làm Shipper
          </h2>
          <p style={{ 
            margin: '10px 0 0',
            fontSize: '14px',
            opacity: 0.9 
          }}>
            Tham gia cùng chúng tôi để trở thành đối tác giao hàng
          </p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500',
              color: '#333'
            }}>
              Loại phương tiện:
            </label>
            <select
              name="vehicle_type"
              value={formData.vehicle_type}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d9d9d9',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'all 0.3s'
              }}
            >
              <option value="">Chọn loại phương tiện</option>
              {vehicleTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500',
              color: '#333'
            }}>
              Biển số xe:
            </label>
            <input
              type="text"
              name="license_plate"
              value={formData.license_plate}
              onChange={handleChange}
              placeholder="Nhập biển số xe"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d9d9d9',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'all 0.3s'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500',
              color: '#333'
            }}>
              Số điện thoại:
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d9d9d9',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'all 0.3s'
              }}
            />
          </div>

          <div style={{ marginTop: '32px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#1890ff',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.3s',
                boxShadow: '0 2px 8px rgba(24,144,255,0.35)'
              }}
            >
              {loading ? 'Đang xử lý...' : 'Đăng ký ngay'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: 'transparent',
                color: '#666',
                border: '1px solid #d9d9d9',
                borderRadius: '8px',
                fontSize: '14px',
                marginTop: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              Quay lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShipperRegister; 