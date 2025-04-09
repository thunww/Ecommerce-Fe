import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { registerShipper } from '../../redux/shipperSlice';

const ShipperRegister = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.shipper);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    delivery_address: '',
    vehicle_type: 'bike',
    license_plate: '',
    driver_license: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error('Vui lòng nhập họ tên');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Vui lòng nhập email');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Email không hợp lệ');
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error('Vui lòng nhập số điện thoại');
      return false;
    }
    if (!/^\d{10,15}$/.test(formData.phone)) {
      toast.error('Số điện thoại không hợp lệ');
      return false;
    }
    if (!formData.delivery_address.trim()) {
      toast.error('Vui lòng nhập địa chỉ giao hàng');
      return false;
    }
    if (!formData.license_plate.trim()) {
      toast.error('Vui lòng nhập biển số xe');
      return false;
    }
    if (!formData.driver_license.trim()) {
      toast.error('Vui lòng nhập số bằng lái xe');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await dispatch(registerShipper(formData)).unwrap();
      toast.success('Đăng ký thành công! Vui lòng đợi xét duyệt');
      navigate('/shipper/dashboard');
    } catch (error) {
      toast.error(error || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-red-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-red-900">
          Đăng ký làm shipper
        </h2>
        <p className="mt-2 text-center text-sm text-red-600">
          Nâng cấp tài khoản của bạn để trở thành đối tác vận chuyển
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border-2 border-red-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Thông tin cá nhân */}
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <h3 className="text-lg font-semibold text-red-700 mb-4">Thông tin cá nhân</h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-red-700"
                  >
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-red-300 rounded-md shadow-sm placeholder-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-red-700"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-red-300 rounded-md shadow-sm placeholder-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-red-700"
                  >
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-red-300 rounded-md shadow-sm placeholder-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin địa chỉ */}
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <h3 className="text-lg font-semibold text-red-700 mb-4">Thông tin địa chỉ</h3>
              <div>
                <label
                  htmlFor="delivery_address"
                  className="block text-sm font-medium text-red-700"
                >
                  Địa chỉ giao hàng <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <textarea
                    id="delivery_address"
                    name="delivery_address"
                    required
                    value={formData.delivery_address}
                    onChange={handleChange}
                    rows="3"
                    className="appearance-none block w-full px-3 py-2 border border-red-300 rounded-md shadow-sm placeholder-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Thông tin phương tiện */}
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <h3 className="text-lg font-semibold text-red-700 mb-4">Thông tin phương tiện</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="vehicle_type"
                    className="block text-sm font-medium text-red-700"
                  >
                    Loại phương tiện <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <select
                      id="vehicle_type"
                      name="vehicle_type"
                      required
                      value={formData.vehicle_type}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-red-300 rounded-md shadow-sm placeholder-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    >
                      <option value="bike">Xe máy</option>
                      <option value="car">Ô tô</option>
                      <option value="truck">Xe tải</option>
                      <option value="van">Xe van</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="license_plate"
                    className="block text-sm font-medium text-red-700"
                  >
                    Biển số xe <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="license_plate"
                      name="license_plate"
                      type="text"
                      required
                      value={formData.license_plate}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-red-300 rounded-md shadow-sm placeholder-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="driver_license"
                    className="block text-sm font-medium text-red-700"
                  >
                    Số bằng lái xe <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="driver_license"
                      name="driver_license"
                      type="text"
                      required
                      value={formData.driver_license}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-red-300 rounded-md shadow-sm placeholder-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition duration-150 ease-in-out"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  'Đăng ký'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShipperRegister; 