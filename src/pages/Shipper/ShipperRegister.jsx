import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerShipper } from '../../redux/shipperSlice';
import AddressSelector from '../../components/AddressSelector';

const ShipperRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const { loading, error, success } = useSelector((state) => state.shipper);

  const [formData, setFormData] = useState({
    phone: userInfo?.phone || '',
    vehicle_type: '',
    driver_license: '',
    province: '',
    district: '',
    ward: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (success) {
      toast.success('Đăng ký thành công! Vui lòng chờ xét duyệt tài khoản.');
      navigate('/');
    }
  }, [success, navigate]);

  useEffect(() => {
    if (userInfo?.shipper?.isActive) {
      navigate('/shipper/dashboard');
    }
  }, [userInfo, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleAddressChange = (address) => {
    setFormData({
      ...formData,
      province: address.province,
      district: address.district,
      ward: address.ward,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    if (!formData.vehicle_type.trim()) newErrors.vehicle_type = 'Vui lòng chọn loại phương tiện';
    if (!formData.driver_license.trim()) newErrors.driver_license = 'Vui lòng nhập số giấy phép lái xe';
    if (!formData.province.trim()) newErrors.province = 'Vui lòng chọn tỉnh/thành phố';
    if (!formData.district.trim()) newErrors.district = 'Vui lòng chọn quận/huyện';
    if (!formData.ward.trim()) newErrors.ward = 'Vui lòng chọn phường/xã';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const shipperData = {
          phone: formData.phone,
          vehicle_type: formData.vehicle_type,
          driver_license: formData.driver_license,
          province: formData.province,
          district: formData.district,
          ward: formData.ward,
        };

        await dispatch(registerShipper(shipperData));
        toast.success('Đăng ký thành công! Vui lòng đợi xét duyệt');
        navigate('/shipper/dashboard');
      } catch (error) {
        console.error('Error registering shipper:', error);
        toast.error(error.message || 'Đăng ký thất bại');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-red-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-red-900">Đăng ký làm shipper</h2>
          <p className="mt-2 text-lg text-red-700">
            Hoàn thành thông tin để bắt đầu công việc giao hàng
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Thông tin liên hệ */}
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-red-900 mb-4">Thông tin liên hệ</h3>
              <div>
                <label className="block text-sm font-medium text-red-700">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-red-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  required
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>
            </div>

            {/* Thông tin địa chỉ */}
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-red-900 mb-4">Khu vực hoạt động</h3>
              <AddressSelector 
                type="shipper"
                onAddressChange={handleAddressChange} 
              />
              {errors.province && <p className="mt-1 text-sm text-red-600">{errors.province}</p>}
              {errors.district && <p className="mt-1 text-sm text-red-600">{errors.district}</p>}
              {errors.ward && <p className="mt-1 text-sm text-red-600">{errors.ward}</p>}
            </div>

            {/* Thông tin phương tiện */}
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-red-900 mb-4">Thông tin phương tiện</h3>
              <div>
                <label className="block text-sm font-medium text-red-700">
                  Loại phương tiện <span className="text-red-500">*</span>
                </label>
                <select
                  name="vehicle_type"
                  value={formData.vehicle_type}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                  required
                >
                  <option value="">Chọn loại phương tiện</option>
                  <option value="bike">Xe máy</option>
                  <option value="car">Ô tô</option>
                  <option value="truck">Xe tải</option>
                  <option value="van">Xe van</option>
                </select>
                {errors.vehicle_type && <p className="mt-1 text-sm text-red-600">{errors.vehicle_type}</p>}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-red-700">
                  Số giấy phép lái xe <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="driver_license"
                  value={formData.driver_license}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-red-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  required
                />
                {errors.driver_license && <p className="mt-1 text-sm text-red-600">{errors.driver_license}</p>}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {loading ? 'Đang xử lý...' : 'Đăng ký'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShipperRegister; 