import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUser,
  fetchUserById,
  uploadAvatar,
} from "../../../../redux/adminSlice";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTransgender,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

const ProfileField = ({ icon, label, value, isEditing, onChange, name }) => {
  let formattedValue = value;

  if (name === "date_of_birth" && value) {
    try {
      formattedValue = format(parseISO(value), "dd/MM/yyyy");
    } catch (error) {
      console.error("Invalid date:", value);
    }
  }

  return (
    <div className="mb-5 transition-all duration-300 transform hover:translate-y-[-2px]">
      <div className="flex items-center gap-2 text-gray-600 mb-1.5">
        <div className="text-blue-500">{icon}</div>
        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      {isEditing ? (
        name === "date_of_birth" ? (
          <input
            type="date"
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            value={value ? value.split("T")[0] : ""}
            onChange={(e) => onChange(name, e.target.value)}
          />
        ) : name === "gender" ? (
          <select
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white transition-all duration-200"
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        ) : (
          <input
            type="text"
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            value={value || ""}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder={`Enter your ${label.toLowerCase()}`}
          />
        )
      ) : (
        <p className="text-base font-medium text-gray-800 py-2 px-3 bg-gray-50 rounded-lg truncate">
          {formattedValue || "Not updated yet"}
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

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

  const handleSave = async () => {
    if (!profileData) return;

    const formData = new FormData();
    formData.append("user_id", userId);

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    let uploadedImageUrl = profileData.profile_picture;

    if (selectedImage) {
      try {
        const resultAction = await dispatch(uploadAvatar(formData));
        if (uploadAvatar.fulfilled.match(resultAction)) {
          uploadedImageUrl = resultAction.payload;
        } else {
          console.error("Failed to upload avatar:", resultAction.error.message);
          return;
        }
      } catch (error) {
        console.error("Image upload error:", error);
        return;
      }
    }

    const updatedData = {
      first_name:
        profileData.first_name !== user.first_name
          ? profileData.first_name
          : undefined,
      last_name:
        profileData.last_name !== user.last_name
          ? profileData.last_name
          : undefined,
      phone: profileData.phone !== user.phone ? profileData.phone : undefined,
      date_of_birth:
        profileData.date_of_birth !== user.date_of_birth
          ? profileData.date_of_birth
          : undefined,
      gender:
        profileData.gender !== user.gender ? profileData.gender : undefined,
      profile_picture: selectedImage ? uploadedImageUrl : undefined,
    };

    const filteredData = Object.fromEntries(
      Object.entries(updatedData).filter(([_, value]) => value !== undefined)
    );

    dispatch(updateUser({ user_id: userId, ...filteredData }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (user) {
      setProfileData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone: user.phone || "",
        date_of_birth: user.date_of_birth || "",
        gender: user.gender || " ",
        profile_picture: user.profile_picture || "",
      });
    }
    setIsEditing(false);
  };

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="profile-page bg-gray-50 p-6 rounded-xl">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div className="w-full mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span className="bg-blue-500 text-white p-1.5 rounded-lg">
              <FaUser className="text-sm" />
            </span>
            Personal Information
          </h1>
          <p className="text-sm text-gray-600 pl-1">
            Manage your personal information for account security
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 p-6 flex flex-col items-center bg-gradient-to-b from-blue-50 to-white border-b md:border-b-0 md:border-r border-gray-200">
            <div className="relative mb-6 group">
              <div className="w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-full border-4 border-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img
                  src={
                    selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : profileData.profile_picture || "/avatar.jpg"
                  }
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/avatar.jpg";
                  }}
                />
              </div>
              {isEditing && (
                <>
                  <label
                    htmlFor="image-upload"
                    className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-2 text-white cursor-pointer shadow-md hover:bg-blue-600 transition-all"
                  >
                    <FaEdit size={16} />
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files.length > 0) {
                        setSelectedImage(e.target.files[0]);
                      }
                    }}
                  />
                </>
              )}
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {profileData.first_name} {profileData.last_name}
            </h3>
            <p className="text-gray-500 text-sm mb-6">User ID: {userId}</p>

            {isEditing ? (
              <div className="flex gap-3 w-full mt-4">
                <button
                  onClick={handleSave}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <FaSave /> Save
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 border border-gray-200"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow"
              >
                <FaEdit /> Edit
              </button>
            )}
          </div>

          <div className="w-full md:w-2/3 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
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
                icon={<FaCalendarAlt className="flex-shrink-0" />}
                label="Date of Birth"
                value={profileData.date_of_birth}
                isEditing={isEditing}
                onChange={handleChange}
                name="date_of_birth"
              />
              <ProfileField
                icon={<FaTransgender className="flex-shrink-0" />}
                label="Gender"
                value={profileData.gender}
                isEditing={isEditing}
                onChange={handleChange}
                name="gender"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
