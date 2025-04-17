import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getShipperProfile, updateShipperProfile, updateAvatar } from '../../redux/shipperSlice';

const ShipperProfile = () => {
  const dispatch = useDispatch();
  const { shipper, loading, error } = useSelector((state) => state.shipper);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    vehicle_type: '',
    license_plate: '',
    phone: ''
  });
  
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    dispatch(getShipperProfile())
      .unwrap()
      .then(response => {
        console.log('Profile response:', response);
        if (response.data) {
          setFormData({
            vehicle_type: response.data.vehicle_type || '',
            license_plate: response.data.license_plate || '',
            phone: response.data.phone || ''
          });
        }
      })
      .catch(error => {
        console.error('Error fetching shipper profile:', error);
      });
  }, [dispatch]);

  useEffect(() => {
    if (shipper) {
      setFormData({
        vehicle_type: shipper.vehicle_type || '',
        license_plate: shipper.license_plate || '',
        phone: shipper.phone || ''
      });
      
      if (shipper.avatar) {
        setPreviewUrl(shipper.avatar);
      }
    }
  }, [shipper]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.vehicle_type || !formData.license_plate || !formData.phone) {
        toast.error('Vui lòng điền đầy đủ thông tin');
        return;
      }

      const result = await dispatch(updateShipperProfile({
        vehicle_type: formData.vehicle_type,
        license_plate: formData.license_plate,
        phone: formData.phone
      })).unwrap();

      if (result.success) {
        toast.success('Cập nhật thông tin thành công');
        dispatch(getShipperProfile());
        setIsEditing(false);
      } else {
        toast.error(result.message || 'Cập nhật thông tin thất bại');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(err.message || 'Cập nhật thông tin thất bại');
    }
  };

  const handleAvatarSubmit = async (e) => {
    e.preventDefault();
    if (!avatar) {
      toast.error('Vui lòng chọn ảnh');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', avatar);

    try {
      const result = await dispatch(updateAvatar(formData)).unwrap();
      
      if (result.success) {
        setAvatar(null);
        toast.success('Cập nhật ảnh đại diện thành công');
        dispatch(getShipperProfile());
      } else {
        toast.error(result.message || 'Cập nhật ảnh đại diện thất bại');
      }
    } catch (err) {
      console.error('Error updating avatar:', err);
      toast.error(err.message || 'Cập nhật ảnh đại diện thất bại');
    }
  };

  const getVehicleTypeText = (type) => {
    switch (type) {
      case 'motorcycle':
        return 'Xe máy';
      case 'bike':
        return 'Xe đạp';
      case 'car':
        return 'Ô tô';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  const renderEditMode = () => (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden">
            <img 
              src={previewUrl || shipper?.avatar} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-red-50 file:text-red-700
                hover:file:bg-red-100"
            />
            {avatar && (
              <button
                onClick={handleAvatarSubmit}
                type="button"
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
              >
                Cập nhật ảnh
              </button>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại phương tiện
            </label>
            <select
              name="vehicle_type"
              value={formData.vehicle_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">Chọn loại phương tiện</option>
              <option value="motorcycle">Xe máy</option>
              <option value="bike">Xe đạp</option>
              <option value="car">Ô tô</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biển số xe
            </label>
            <input
              type="text"
              name="license_plate"
              value={formData.license_plate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Lưu thay đổi
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  vehicle_type: shipper.vehicle_type || '',
                  license_plate: shipper.license_plate || '',
                  phone: shipper.phone || ''
                });
              }}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Hủy
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  const renderViewMode = () => {
    // Lấy thông tin user từ shipper data
    const userData = shipper?.user || {};
    
    return (
      <div className="space-y-6">
        <div className="flex items-start space-x-6">
          <div className="w-32 h-32 rounded-full overflow-hidden">
            <img 
              src={shipper?.avatar || '/default-avatar.png'} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Họ và tên
                </h2>
                <p className="text-gray-600">
                  {userData.first_name} {userData.last_name}
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Email
                </h2>
                <p className="text-gray-600">{userData.email}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Số điện thoại
                </h2>
                <p className="text-gray-600">{shipper?.phone}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Loại phương tiện
                </h2>
                <p className="text-gray-600">
                  {getVehicleTypeText(shipper?.vehicle_type)}
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Biển số xe
                </h2>
                <p className="text-gray-600">{shipper?.license_plate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h1>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>
            {isEditing ? renderEditMode() : renderViewMode()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperProfile;