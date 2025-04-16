import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getShipperProfile, updateShipperProfile, updateAvatar, updateOrderLocation } from '../../redux/shipperSlice';
import AddressSelector from '../../components/AddressSelector';
import axios from 'axios';

const ShipperProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error, success } = useSelector((state) => state.shipper);
  const { userInfo } = useSelector((state) => state.user);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    vehicle_type: '',
    driver_license: '',
  });
  
  const [locationForm, setLocationForm] = useState({
    province: '',
    district: '',
    ward: '',
  });
  
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    dispatch(getShipperProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: userInfo?.full_name || '',
        phone: userInfo?.phone || '',
        email: userInfo?.email || '',
        vehicle_type: profile.vehicle_type || '',
        driver_license: profile.driver_license || '',
      });
      
      if (profile.currentLocation) {
        setLocationForm({
          province: profile.currentLocation.province || '',
          district: profile.currentLocation.district || '',
          ward: profile.currentLocation.ward || ''
        });
      }
    }
  }, [profile, userInfo]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success('Cập nhật thông tin thành công');
    }
  }, [error, success]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLocationChange = (address) => {
    setLocationForm({
      province: address.province,
      district: address.district,
      ward: address.ward,
    });
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_URL}/shipper/update-location`,
        locationForm,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.data.success) {
        toast.success('Cập nhật vị trí thành công');
        dispatch(getShipperProfile());
      }
    } catch (error) {
      console.error('Error updating location:', error);
      toast.error('Cập nhật vị trí thất bại');
    }
  };

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Cập nhật thông tin user
      await axios.put(
        `${API_URL}/user/update-profile`,
        {
          full_name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Cập nhật thông tin shipper
      await dispatch(updateShipperProfile({
        vehicle_type: formData.vehicle_type,
        driver_license: formData.driver_license,
      })).unwrap();

      toast.success('Cập nhật thông tin thành công');
    } catch (err) {
      toast.error(err.message || 'Cập nhật thông tin thất bại');
    }
  };

  const handleAvatarSubmit = async (e) => {
    e.preventDefault();
    if (!avatar) return;

    const formData = new FormData();
    formData.append('avatar', avatar);

    try {
      await dispatch(updateAvatar(formData)).unwrap();
      setAvatar(null);
      toast.success('Cập nhật ảnh đại diện thành công');
    } catch (err) {
      toast.error(err.message || 'Cập nhật ảnh đại diện thất bại');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Thông tin cá nhân</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form cập nhật thông tin */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Cập nhật thông tin</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Họ và tên</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Loại phương tiện</label>
              <select
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">Chọn loại phương tiện</option>
                <option value="bike">Xe máy</option>
                <option value="car">Ô tô</option>
                <option value="truck">Xe tải</option>
                <option value="van">Xe van</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Bằng lái xe</label>
              <input
                type="text"
                name="driver_license"
                value={formData.driver_license}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Cập nhật
            </button>
          </form>
        </div>

        <div className="space-y-8">
          {/* Form cập nhật avatar */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Cập nhật ảnh đại diện</h2>
            <form onSubmit={handleAvatarSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Chọn ảnh</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="w-full"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={!avatar}
              >
                Tải lên
              </button>
            </form>
            {userInfo?.avatar && (
              <div className="mt-4">
                <img
                  src={userInfo.avatar}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Form cập nhật vị trí */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Cập nhật vị trí giao hàng</h2>
            <form onSubmit={handleLocationSubmit}>
              <AddressSelector 
                onAddressChange={handleLocationChange}
                defaultAddress={{
                  province: profile?.currentLocation?.province || '',
                  district: profile?.currentLocation?.district || '',
                  ward: profile?.currentLocation?.ward || ''
                }}
              />
              <button
                type="submit"
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Cập nhật vị trí
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperProfile;