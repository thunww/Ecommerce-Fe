import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import authService from "../../../services/authService";

const UserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userFormData, setUserFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    gender: "male",
    dob: { date: "", month: "", year: "" },
    avatar_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTC5qazavqTLCrmQCDwfMAdvNEE8Xa7pSzSw&s",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(userFormData.avatar_url);

  // Fetch user data from API
  useEffect(() => {
    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && (user.id || user.user_id)) {
      const userId = user.id || user.user_id;
      fetchUserData(userId);
    } else {
      toast.error("User information not found, please login again");
    }
  }, []);

  // Function to get user info by ID
  const fetchUserData = async (userId) => {
    try {
      setLoading(true);
      const response = await authService.getUserById(userId);

      if (response && response.success === true && response.user) {
        const user = response.user;

        // Assign user info directly
        setUserData(user);

        // Process date of birth
        let dobObj = { date: "", month: "", year: "" };
        if (user.date_of_birth) {
          const dobDate = new Date(user.date_of_birth);
          if (!isNaN(dobDate.getTime())) {
            dobObj = {
              date: dobDate.getDate().toString(),
              month: (dobDate.getMonth() + 1).toString(),
              year: dobDate.getFullYear().toString(),
            };
          }
        }

        // Update user info to userFormData
        setUserFormData((prevData) => {
          const updatedData = {
            ...prevData,
            username: user.username || "",
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
            gender: user.gender || "male",
            dob: dobObj,
          };
          return updatedData;
        });

        // Update avatar from user.profile_picture if available
        if (user.profile_picture) {
          setPreviewUrl(user.profile_picture);
        }
      } else {
        toast.error("Invalid user data format");
      }
    } catch (error) {
      toast.error("Unable to retrieve user information");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setUserFormData({
      ...userFormData,
      [field]: value,
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Get user ID from userData or localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      const userId =
        userData?.user_id || userData?.id || user?.user_id || user?.id;

      if (!userId) {
        toast.error("User ID not found");
        return;
      }

      // Create data object to update
      const updateData = {
        first_name: userFormData.first_name,
        last_name: userFormData.last_name,
        phone: userFormData.phone,
        address: userFormData.address,
        gender: userFormData.gender,
        date_of_birth:
          userFormData.dob.year &&
          userFormData.dob.month &&
          userFormData.dob.date
            ? `${userFormData.dob.year}-${userFormData.dob.month.padStart(
                2,
                "0"
              )}-${userFormData.dob.date.padStart(2, "0")}`
            : undefined,
      };


      // Call API to update user information
      const response = await fetch(`/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Information updated successfully!");

        // Refresh user information
        fetchUserData(userId);
      } else {
        toast.error(data.message || "Failed to update information");
      }
    } catch (error) {
      toast.error(
        "Error updating information: " + (error.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size cannot exceed 2MB");
        return;
      }

      // Check file format
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        toast.error("Only JPEG, PNG, or GIF image formats are accepted");
        return;
      }

      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image before uploading");
      return;
    }

    try {
      setLoading(true);

      // Get user ID from userData or localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      const userId =
        userData?.user_id || userData?.id || user?.user_id || user?.id;

      if (!userId) {
        toast.error("User ID not found");
        return;
      }

      // Create FormData to send file
      const formData = new FormData();
      formData.append("profile_picture", selectedFile);

      // Call API to upload image
      const response = await fetch(`/users/${userId}/profile-picture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Profile picture updated successfully!");

        // Update user info in localStorage immediately
        // so avatar displays on header
        if (data.user && data.user.profile_picture) {
          // Get current user info from localStorage
          const currentUser = JSON.parse(localStorage.getItem("user"));
          if (currentUser) {
            // Update new avatar
            currentUser.profile_picture = data.user.profile_picture;
            // Save back to localStorage
            localStorage.setItem("user", JSON.stringify(currentUser));

            
          }
        } else if (data.profile_picture) {
          // Case where API only returns image URL
          const currentUser = JSON.parse(localStorage.getItem("user"));
          if (currentUser) {
            currentUser.profile_picture = data.profile_picture;
            localStorage.setItem("user", JSON.stringify(currentUser));

            
          }
        }

        // Update user info on UI
        fetchUserData(userId);
      } else {
        toast.error(data.message || "Failed to update profile picture");
      }
    } catch (error) {
      toast.error(
        "Error uploading image: " + (error.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not updated";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid";
    return date.toLocaleDateString("en-US");
  };

  return (
    <div className="px-4 py-3 bg-gray-50">
      <div className="mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-5xl">
        <div className="md:flex">
          <div className="md:w-1/4 bg-gray-50 p-4">
            <div className="text-center">
              <div className="mb-4">
                <img
                  className="mx-auto h-24 w-24 rounded-full border-4 border-white shadow-lg"
                  src={previewUrl}
                  alt="User Avatar"
                />
                <h2 className="text-xl font-semibold mt-2">
                  {userData?.username || "Loading..."}
                </h2>
                <p className="text-gray-500 text-sm">
                  {userData?.email || "email@example.com"}
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                <button className="flex items-center justify-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                  <FaEdit className="text-sm" />
                  <span>Edit</span>
                </button>

                <button className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                  <span>Notifications</span>
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex flex-col space-y-2">
                <button className="flex items-center space-x-3 bg-white p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium text-gray-700">
                    Personal Information
                  </span>
                </button>

                <button className="flex items-center space-x-3 bg-white p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                  </svg>
                  <span className="font-medium text-gray-700">
                    Order History
                  </span>
                </button>

                <button className="flex items-center space-x-3 bg-white p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium text-gray-700">Security</span>
                </button>

                <button className="flex items-center space-x-3 bg-white p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path
                      fillRule="evenodd"
                      d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium text-gray-700">
                    Payment Methods
                  </span>
                </button>

                <button className="flex items-center space-x-3 bg-white p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium text-gray-700">Settings</span>
                </button>
              </div>
            </div>
          </div>

          <div className="md:w-3/4 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Account Information
              </h1>
              <p className="text-gray-600">
                Manage your personal and account information
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">User Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50"
                    value={userFormData.username}
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={userFormData.last_name}
                    onChange={(e) =>
                      handleInputChange("last_name", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={userFormData.first_name}
                    onChange={(e) =>
                      handleInputChange("first_name", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50"
                    value={userFormData.email}
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={userFormData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={userFormData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={userFormData.gender}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Join Date
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50"
                    value={
                      userData ? formatDate(userData.created_at) : "Loading..."
                    }
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Status
                  </label>
                  <div className="flex items-center mt-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        userData?.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {userData?.status === "active" ? "ACTIVE" : "LOCKED"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>

              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-3">
                    Upload your photo. The image must be in JPG, PNG, or GIF
                    format and no larger than 2MB.
                  </p>

                  <div className="flex space-x-3">
                    <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      Choose Image
                      <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg, image/png, image/gif"
                        onChange={handleImageChange}
                      />
                    </label>

                    <button
                      onClick={handleImageUpload}
                      disabled={!selectedFile || loading}
                      className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {loading ? "Uploading..." : "Upload"}
                    </button>
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

export default UserProfile;
