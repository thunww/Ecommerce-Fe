import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ShipperRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    idCard: '',
    vehicleType: '',
    licensePlate: '',
    driverLicense: '',
    bankName: '',
    bankAccount: '',
    bankAccountName: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Email không hợp lệ!');
      return false;
    }

    // Validate phone number (10 digits)
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Số điện thoại không hợp lệ! (Vui lòng nhập số điện thoại 10 số)');
      return false;
    }

    // Validate password length
    if (formData.password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
      return false;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return false;
    }

    // Validate CCCD (12 digits)
    const idCardRegex = /^([0-9]{12})\b/;
    if (!idCardRegex.test(formData.idCard)) {
      toast.error('Số CCCD không hợp lệ! (Vui lòng nhập đủ 12 số)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // TODO: Implement API call to register shipper
      toast.success('Đăng ký thành công!');
      navigate('/shipper');
    } catch (error) {
      toast.error('Đăng ký thất bại. Vui lòng thử lại!');
    }
  };

  const inputClassName = "mt-1 block w-full rounded-md border-2 border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500 px-3 py-2";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 border-2 border-red-200">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-8">Đăng ký làm Shipper</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <h3 className="text-lg font-semibold text-red-700 mb-4">Thông tin cá nhân</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  placeholder="Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  placeholder="0912345678"
                  pattern="(0[3|5|7|8|9])+([0-9]{8})\b"
                  title="Vui lòng nhập số điện thoại hợp lệ (10 số)"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="idCard" className="block text-sm font-medium text-gray-700">
                  Số CCCD/CMND <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="idCard"
                  name="idCard"
                  required
                  placeholder="079123456789"
                  pattern="[0-9]{12}"
                  title="Vui lòng nhập đủ 12 số CCCD"
                  value={formData.idCard}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <h3 className="text-lg font-semibold text-red-700 mb-4">Thông tin tài khoản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  placeholder="Tối thiểu 6 ký tự"
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  placeholder="Nhập lại mật khẩu"
                  minLength={6}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <h3 className="text-lg font-semibold text-red-700 mb-4">Địa chỉ</h3>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Địa chỉ chi tiết <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                required
                placeholder="Số nhà, Đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className={inputClassName}
              />
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <h3 className="text-lg font-semibold text-red-700 mb-4">Thông tin phương tiện</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
                  Loại phương tiện <span className="text-red-500">*</span>
                </label>
                <select
                  id="vehicleType"
                  name="vehicleType"
                  required
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className={inputClassName}
                >
                  <option value="">Chọn loại phương tiện</option>
                  <option value="motorcycle">Xe máy</option>
                  <option value="bicycle">Xe đạp</option>
                  <option value="car">Ô tô</option>
                </select>
              </div>

              <div>
                <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">
                  Biển số xe <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="licensePlate"
                  name="licensePlate"
                  required
                  placeholder="59-X1 23456"
                  value={formData.licensePlate}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="driverLicense" className="block text-sm font-medium text-gray-700">
                  Số bằng lái xe <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="driverLicense"
                  name="driverLicense"
                  required
                  placeholder="790123456789"
                  value={formData.driverLicense}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <h3 className="text-lg font-semibold text-red-700 mb-4">Thông tin ngân hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                  Tên ngân hàng <span className="text-red-500">*</span>
                </label>
                <select
                  id="bankName"
                  name="bankName"
                  required
                  value={formData.bankName}
                  onChange={handleChange}
                  className={inputClassName}
                >
                  <option value="">Chọn ngân hàng</option>
                  <option value="VCB">Vietcombank (VCB)</option>
                  <option value="TCB">Techcombank (TCB)</option>
                  <option value="VTB">VietinBank (VTB)</option>
                  <option value="BIDV">BIDV</option>
                  <option value="ACB">ACB</option>
                  <option value="MBB">MB Bank (MBB)</option>
                  <option value="TPB">TPBank (TPB)</option>
                  <option value="MSB">MSB</option>
                  <option value="VPB">VPBank (VPB)</option>
                  <option value="OCB">OCB</option>
                  <option value="HDB">HDBank (HDB)</option>
                  <option value="SHB">SHB</option>
                </select>
              </div>

              <div>
                <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700">
                  Số tài khoản <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="bankAccount"
                  name="bankAccount"
                  required
                  placeholder="Nhập số tài khoản ngân hàng"
                  value={formData.bankAccount}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="bankAccountName" className="block text-sm font-medium text-gray-700">
                  Tên chủ tài khoản <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="bankAccountName"
                  name="bankAccountName"
                  required
                  placeholder="Nhập tên chủ tài khoản (viết HOA không dấu)"
                  value={formData.bankAccountName}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              Đăng ký
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <button
              onClick={() => navigate('/shipper/login')}
              className="font-medium text-red-600 hover:text-red-500 transition-colors duration-200"
            >
              Đăng nhập
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShipperRegister; 