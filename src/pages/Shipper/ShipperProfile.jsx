import React, { useState, useEffect } from "react";
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaCar, FaStar, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useUser } from "../../contexts/UserContext";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({ ...userInfo });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  // Reset editedInfo when userInfo changes
  useEffect(() => {
    setEditedInfo({ ...userInfo });
  }, [userInfo]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!editedInfo.phone?.match(/^[0-9]{10}$/)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    
    if (!editedInfo.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Email không hợp lệ";
    }
    
    if (!editedInfo.name?.trim()) {
      newErrors.name = "Họ và tên không được để trống";
    }
    
    if (!editedInfo.locations?.length) {
      newErrors.locations = "Vui lòng chọn ít nhất một khu vực hoạt động";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedInfo((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value,
      },
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
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

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user info with new avatar if selected
      const updatedInfo = {
        ...editedInfo,
        avatar: selectedAvatar || editedInfo.avatar
      };
      
      updateUserInfo(updatedInfo);
      setIsEditing(false);
      setErrors({});
      setSelectedAvatar(null);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Không thể lưu thông tin. Vui lòng thử lại sau.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedInfo({ ...userInfo });
    setIsEditing(false);
    setErrors({});
    setSelectedAvatar(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h2>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    disabled={isSaving}
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                    disabled={isSaving}
                  >
                    {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                <img
                  src={editedInfo.avatar || '/default-avatar.jpg'}
                  alt={userInfo.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/default-avatar.jpg';
                  }}
                />
              </div>
              {isEditing && (
                <div>
                  <label
                    htmlFor="avatar-upload"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    Thay đổi ảnh
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* Info section */}
            <div className="flex-1 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editedInfo.name}
                      onChange={(e) =>
                        setEditedInfo({ ...editedInfo, name: e.target.value })
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900">{userInfo.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="email"
                      value={editedInfo.email}
                      onChange={(e) =>
                        setEditedInfo({ ...editedInfo, email: e.target.value })
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900">{userInfo.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="tel"
                      value={editedInfo.phone}
                      onChange={(e) =>
                        setEditedInfo({ ...editedInfo, phone: e.target.value })
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900">{userInfo.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khu vực hoạt động
                </label>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {editedInfo.locations?.map((location, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white rounded-full"
                        >
                          <span>{`${location.district}, ${location.ward}`}</span>
                          <button
                            onClick={() => {
                              const newLocations = editedInfo.locations.filter((_, i) => i !== index);
                              setEditedInfo(prev => ({
                                ...prev,
                                locations: newLocations
                              }));
                            }}
                            className="hover:text-red-200"
                          >
                            <FaTimes size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border rounded-md p-4 space-y-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Tỉnh/Thành phố</label>
                        <select
                          className="w-full p-2 border rounded-md"
                          value={selectedProvince || ""}
                          onChange={(e) => {
                            setSelectedProvince(e.target.value);
                            setSelectedDistrict("");
                            setSelectedWard("");
                          }}
                        >
                          <option value="">Chọn Tỉnh/Thành phố</option>
                          {PROVINCES.map(province => (
                            <option key={province.id} value={province.name}>
                              {province.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedProvince && (
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Quận/Huyện</label>
                          <select
                            className="w-full p-2 border rounded-md"
                            value={selectedDistrict || ""}
                            onChange={(e) => {
                              setSelectedDistrict(e.target.value);
                              setSelectedWard("");
                            }}
                          >
                            <option value="">Chọn Quận/Huyện</option>
                            {PROVINCES.find(p => p.name === selectedProvince)
                              ?.districts.map(district => (
                                <option key={district.id} value={district.name}>
                                  {district.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      )}

                      {selectedDistrict && (
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Phường/Xã</label>
                          <select
                            className="w-full p-2 border rounded-md"
                            value={selectedWard || ""}
                            onChange={(e) => setSelectedWard(e.target.value)}
                          >
                            <option value="">Chọn Phường/Xã</option>
                            {PROVINCES.find(p => p.name === selectedProvince)
                              ?.districts.find(d => d.name === selectedDistrict)
                              ?.wards.map(ward => (
                                <option key={ward.id} value={ward.name}>
                                  {ward.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      )}

                      <button
                        className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!selectedWard}
                        onClick={() => {
                          if (selectedProvince && selectedDistrict && selectedWard) {
                            const newLocation = {
                              province: selectedProvince,
                              district: selectedDistrict,
                              ward: selectedWard
                            };
                            
                            // Check if location already exists
                            const locationExists = editedInfo.locations?.some(
                              loc => 
                                loc.province === newLocation.province &&
                                loc.district === newLocation.district &&
                                loc.ward === newLocation.ward
                            );

                            if (!locationExists) {
                              setEditedInfo(prev => ({
                                ...prev,
                                locations: [...(prev.locations || []), newLocation]
                              }));
                            }

                            // Reset selections
                            setSelectedProvince("");
                            setSelectedDistrict("");
                            setSelectedWard("");
                          }
                        }}
                      >
                        Thêm khu vực
                      </button>
                    </div>
                    {errors.locations && (
                      <p className="mt-1 text-sm text-red-500">{errors.locations}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {userInfo.locations?.map((location, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
                      >
                        {`${location.district}, ${location.ward}`}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Thông tin đánh giá */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin đánh giá</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-500">{userInfo.totalOrders}</div>
                    <div className="text-sm text-gray-600">Tổng đơn hàng</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">{userInfo.completionRate}</div>
                    <div className="text-sm text-gray-600">Tỷ lệ hoàn thành</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">{userInfo.onTimeRate}</div>
                    <div className="text-sm text-gray-600">Tỷ lệ đúng giờ</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-500">{userInfo.rating}</div>
                    <div className="text-sm text-gray-600">Đánh giá</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperProfile;