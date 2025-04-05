import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser, fetchUserById } from "../../../../redux/adminSlice";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTransgender,
} from "react-icons/fa";

const ProfileField = ({ icon, label, value, isEditing, onChange, name }) => {
  return (
    <div className="mb-3 sm:mb-4">
      <div className="flex items-center gap-2 text-gray-500 mb-1">
        {icon}
        <span className="text-xs sm:text-sm">{label}</span>
      </div>
      {isEditing ? (
        <input
          type="text"
          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={value || ""}
          onChange={(e) => onChange(name, e.target.value)}
        />
      ) : (
        <p className="text-sm sm:text-base font-medium truncate">
          {value || "Chưa cập nhật"}
        </p>
      )}
    </div>
  );
};

const Profile = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.user_id);
  const user = useSelector((state) => state.admin.selectedUser);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone: user.phone || "",
        date_of_birth: user.date_of_birth || "",
        gender: user.gender || "",
        profile_picture: user.profile_picture || "",
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!profileData) return;

    const updatedData = {
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      phone: profileData.phone,
      date_of_birth: profileData.date_of_birth,
      gender: profileData.gender,
      profile_picture: profileData.profile_picture,
    };

    dispatch(updateUser({ user_id: userId, ...updatedData }));

    console.log("Saving profile data:", updatedData);

    setIsEditing(false);
  };

  const handleCancel = () => {
    if (user) {
      setProfileData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone: user.phone || "",
        date_of_birth: user.date_of_birth || "",
        gender: user.gender || "Nam",
        profile_picture: user.profile_picture || "",
      });
    }
    setIsEditing(false);
  };

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="flex flex-col md:flex-row">
        <div className="w-full mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
            Thông tin cá nhân
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Quản lý thông tin cá nhân để bảo mật tài khoản
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 p-4 sm:p-6 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-200">
            <div className="relative mb-4 sm:mb-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 overflow-hidden rounded-full border-4 border-gray-100 shadow">
                <img
                  src={profileData.profile_picture || "/avatar.jpg"}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/avatar.jpg";
                  }}
                />
              </div>
            </div>

            {isEditing ? (
              <div className="flex gap-2 w-full">
                <button
                  onClick={handleSave}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-md text-sm transition"
                >
                  Lưu
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-1.5 sm:py-2 px-3 sm:px-4 rounded-md text-sm transition"
                >
                  Hủy
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-500 border border-blue-200 py-1.5 sm:py-2 px-3 sm:px-4 rounded-md text-sm transition"
              >
                Chỉnh sửa
              </button>
            )}
          </div>

          <div className="w-full md:w-2/3 p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-6">
              <ProfileField
                icon={<FaUser className="flex-shrink-0" />}
                label="First name"
                value={profileData.first_name}
                isEditing={isEditing}
                onChange={handleChange}
                name="first_name"
              />
              <ProfileField
                icon={<FaUser className="flex-shrink-0" />}
                label="Last name"
                value={profileData.last_name}
                isEditing={isEditing}
                onChange={handleChange}
                name="last_name"
              />
              <ProfileField
                icon={<FaPhone className="flex-shrink-0" />}
                label="Phone"
                value={profileData.phone}
                isEditing={isEditing}
                onChange={handleChange}
                name="phone"
              />
              <ProfileField
                icon={<FaTransgender className="flex-shrink-0" />}
                label="Gender"
                value={profileData.gender}
                isEditing={isEditing}
                onChange={handleChange}
                name="gender"
              />
              <ProfileField
                icon={<FaCalendarAlt className="flex-shrink-0" />}
                label="Date of birth"
                value={profileData.date_of_birth}
                isEditing={isEditing}
                onChange={handleChange}
                name="date_of_birth"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
