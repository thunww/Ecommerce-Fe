import React, { useState, useEffect } from "react";
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaCar, FaStar, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useUser } from "../../contexts/UserContext";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AddressSelector from '../../components/AddressSelector';

// Add address data
const PROVINCES = [
  {
    id: "79",
    name: "Thành phố Hồ Chí Minh",
    districts: [
      {
        id: "760",
        name: "Quận 1",
        wards: [
          { id: "26734", name: "Phường Bến Nghé" },
          { id: "26737", name: "Phường Bến Thành" },
          { id: "26740", name: "Phường Cô Giang" },
          // Add more wards...
        ]
      },
      {
        id: "761",
        name: "Quận 12",
        wards: [
          { id: "26743", name: "Phường An Phú Đông" },
          { id: "26746", name: "Phường Đông Hưng Thuận" },
          // Add more wards...
        ]
      },
      // Add more districts...
    ]
  },
  // Add more provinces if needed...
];

const INITIAL_PROFILE = {
  name: "Nguyễn Văn Anh",
  id: "SP10023",
  rating: 4.7,
  totalOrders: 1286,
  completionRate: "98%",
  onTimeRate: "96%",
  avatar: "",
  contact: {
    phone: "0912.345.678",
    email: "vananh@shiperpro.vn",
    locations: [
      {
        province: "Thành phố Hồ Chí Minh",
        district: "Quận 1",
        ward: "Phường Bến Nghé"
      },
      {
        province: "Thành phố Hồ Chí Minh",
        district: "Quận 12",
        ward: "Phường An Phú Đông"
      }
    ],
    joined: "15/06/2023",
    vehicle: "Honda Wave - 59P1-23456",
  },
  reviews: [],
};

const ShipperProfile = () => {
  const { userInfo, updateUserInfo } = useUser();
  const dispatch = useDispatch();
  const { shipper } = useSelector((state) => state.shipper || {});
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({ ...userInfo });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [formData, setFormData] = useState({
    fullName: userInfo?.name || '',
    email: userInfo?.email || '',
    phone: shipper?.phone || '',
    delivery_address: shipper?.delivery_address || '',
    vehicle_type: shipper?.vehicle_type || 'bike',
    license_plate: shipper?.license_plate || '',
    driver_license: shipper?.driver_license || '',
  });

  // Reset editedInfo when userInfo changes
  useEffect(() => {
    setEditedInfo({ ...userInfo });
  }, [userInfo]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ và tên không được để trống";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    }
    
    if (!/^\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    
    if (!formData.delivery_address.trim()) {
      newErrors.delivery_address = "Địa chỉ giao hàng không được để trống";
    }
    
    if (!formData.license_plate.trim()) {
      newErrors.license_plate = "Biển số xe không được để trống";
    }
    
    if (!formData.driver_license.trim()) {
      newErrors.driver_license = "Số bằng lái xe không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (address) => {
    setFormData((prev) => ({
      ...prev,
      delivery_address: address,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        alert('Kích thước ảnh không được vượt quá 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setSelectedAvatar(base64String);
        setEditedInfo(prev => ({
          ...prev,
          avatar: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // TODO: Implement update shipper profile action
      // await dispatch(updateShipperProfile(formData)).unwrap();
      toast.success('Cập nhật thông tin thành công');
    } catch (error) {
      toast.error(error || 'Cập nhật thất bại');
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: userInfo?.name || '',
      email: userInfo?.email || '',
      phone: shipper?.phone || '',
      delivery_address: shipper?.delivery_address || '',
      vehicle_type: shipper?.vehicle_type || 'bike',
      license_plate: shipper?.license_plate || '',
      driver_license: shipper?.driver_license || '',
    });
    setIsEditing(false);
    setErrors({});
    setSelectedAvatar(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-red-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-red-600">
            <h3 className="text-lg leading-6 font-medium text-white">
              Thông tin cá nhân
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-red-100">
              Cập nhật thông tin cá nhân và phương tiện của bạn
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <AddressSelector 
                  onChange={handleAddressChange}
                  value={formData.delivery_address}
                />
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

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cập nhật thông tin
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperProfile;
