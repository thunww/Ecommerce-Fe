import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { getShopInfo } from "../../../services/vendorService";
import authService from "../../../services/authService";

const ShopProfile = () => {
  const [loading, setLoading] = useState(false);
  const [shopInfo, setShopInfo] = useState(null);
  const [userData, setUserData] = useState(null);

  const [shopData, setShopData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "male",
    dob: { date: "", month: "", year: "" },
    avatar_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG4TkxkFuXifNvLsDDaCB69Khm1LzrMFJLJA&s",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(shopData.avatar_url);

  // Fetch user and shop data from API
  useEffect(() => {
    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && (user.id || user.user_id)) {
      const userId = user.id || user.user_id;
      fetchUserData(userId);
    } else {
      toast.error("User information not found, please login again");
    }

    fetchShopInfo();
  }, []);

  const fetchShopInfo = async () => {
    try {
      setLoading(true);
      const response = await getShopInfo();

      // API returns the correct format { shop_id, shop_name, logo, ... }
      if (response) {
        // Response structure can be response or response.data depending on API
        const shopData = response.data || response;
        setShopInfo(shopData);

        // Update avatar using shop logo
        if (shopData.logo) {
          setPreviewUrl(shopData.logo);
        }
      }
    } catch (error) {
      toast.error("Unable to retrieve shop information");
    } finally {
      setLoading(false);
    }
  };

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

        // Update user info to shopData
        setShopData((prevData) => {
          const updatedData = {
            ...prevData,
            username: user.username || "",
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            email: user.email || "",
            phone: user.phone || "",
            gender: user.gender || "male",
            dob: dobObj,
            // Don't update avatar_url from user anymore, prioritize shop logo
          };
          return updatedData;
        });

        // DON'T update avatar from user.profile_picture anymore
        // Only update from shop logo in fetchShopInfo function
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
    setShopData({
      ...shopData,
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
        first_name: shopData.first_name,
        last_name: shopData.last_name,
        phone: shopData.phone,
        gender: shopData.gender,
        date_of_birth:
          shopData.dob.year && shopData.dob.month && shopData.dob.date
            ? `${shopData.dob.year}-${shopData.dob.month.padStart(
                2,
                "0"
              )}-${shopData.dob.date.padStart(2, "0")}`
            : undefined,
      };


      // Call API to update user information - edit API path
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
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile) {
      toast.error("Please select an image before uploading");
      return;
    }

    try {
      setLoading(true);
      // Get shop ID instead of user ID
      const shopId = shopInfo?.shop_id;

      if (!shopId) {
        toast.error("Shop ID not found");
        return;
      }

      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("shop_id", shopId);

      // Edit API URL to update shop logo instead of user avatar
      const response = await fetch("/vendor/update-shop-logo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Shop logo updated successfully!");
        fetchShopInfo(); // Reload shop information
      } else {
        toast.error(data.message || "Failed to update shop logo");
      }
    } catch (error) {
     
      toast.error("Error uploading shop logo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md h-fit">
        <div className="p-4 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
            <img
              src={shopInfo?.logo || previewUrl}
              alt="Shop Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-base font-medium">
            {shopInfo?.shop_name || "My Shop"}
          </div>
          <button className="flex items-center text-gray-500 text-xs mt-1">
            <FaEdit className="mr-1" size={12} /> Edit
          </button>
        </div>

        <div className="mt-2">
          <div className="py-2 px-6 flex items-center hover:bg-gray-50">
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9"
              ></path>
            </svg>
            <span>Notifications</span>
          </div>

          <div className="py-2 px-6 flex items-center hover:bg-gray-50">
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            <span className="font-medium">My Account</span>
          </div>

          <div className="pl-14 py-1 text-gray-700">
            <div className="py-1 text-orange-500">Profile</div>
            <div className="py-1">Bank & Cards</div>
            <div className="py-1">Address</div>
            <div className="py-1">Change Password</div>
            <div className="py-1">Notification Settings</div>
            <div className="py-1">Privacy Settings</div>
          </div>

          <div className="py-2 px-6 flex items-center hover:bg-gray-50">
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              ></path>
            </svg>
            <span>My Orders</span>
          </div>

          <div className="py-2 px-6 flex items-center hover:bg-gray-50">
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              ></path>
            </svg>
            <span>My Vouchers</span>
          </div>

          <div className="py-2 px-6 flex items-center hover:bg-gray-50">
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>Coins</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white m-6 shadow-sm overflow-auto h-fit max-h-[calc(100vh-4rem)]">
        <div className="p-5">
          <div className="mb-3">
            <h1 className="text-xl font-medium">My Shop Profile</h1>
            <p className="text-gray-600 text-sm">
              Manage profile information to secure your account
            </p>
          </div>

          <div className="flex flex-wrap">
            {/* Left Column - Form */}
            <div className="w-full lg:w-2/3 pr-0 lg:pr-10">
              {/* Shop Info - Display shop information first */}
              {shopInfo && (
                <>
                  <div className="mb-3 grid grid-cols-12 items-center">
                    <div className="col-span-3 text-right pr-6 text-gray-600">
                      Shop Name
                    </div>
                    <div className="col-span-9">{shopInfo.shop_name}</div>
                  </div>

                  <div className="mb-3 grid grid-cols-12 items-center">
                    <div className="col-span-3 text-right pr-6 text-gray-600">
                      Address
                    </div>
                    <div className="col-span-9">{shopInfo.address}</div>
                  </div>

                  <div className="mb-3 grid grid-cols-12 items-center">
                    <div className="col-span-3 text-right pr-6 text-gray-600">
                      Description
                    </div>
                    <div className="col-span-9">{shopInfo.description}</div>
                  </div>

                  <div className="mb-3 grid grid-cols-12 items-center">
                    <div className="col-span-3 text-right pr-6 text-gray-600">
                      Rating
                    </div>
                    <div className="col-span-9">{shopInfo.rating} ⭐</div>
                  </div>

                  <div className="mb-3 grid grid-cols-12 items-center">
                    <div className="col-span-3 text-right pr-6 text-gray-600">
                      Followers
                    </div>
                    <div className="col-span-9">{shopInfo.followers}</div>
                  </div>

                  <div className="mb-3 grid grid-cols-12 items-center">
                    <div className="col-span-3 text-right pr-6 text-gray-600">
                      Total Products
                    </div>
                    <div className="col-span-9">{shopInfo.total_products}</div>
                  </div>

                  <div className="mb-3 grid grid-cols-12 items-center">
                    <div className="col-span-3 text-right pr-6 text-gray-600">
                      Views
                    </div>
                    <div className="col-span-9">{shopInfo.views}</div>
                  </div>

                  <div className="mb-3 grid grid-cols-12 items-center">
                    <div className="col-span-3 text-right pr-6 text-gray-600">
                      Status
                    </div>
                    <div className="col-span-9">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          shopInfo.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {shopInfo.status === "active" ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Divider */}
              <div className="my-6 border-t border-gray-200"></div>

              <h2 className="text-lg font-medium mb-4">
                Shop Owner Information
              </h2>

              {/* Username */}
              <div className="mb-3 grid grid-cols-12 items-center">
                <div className="col-span-3 text-right pr-6 text-gray-600">
                  Username
                </div>
                <div className="col-span-9">
                  {userData ? userData.username : shopData.username}
                </div>
              </div>

              {/* Owner Name Section - Combine First Name and Last Name */}
              <div className="mb-3 grid grid-cols-12 items-center">
                <div className="col-span-3 text-right pr-6 text-gray-600">
                  Shop Owner Name
                </div>
                <div className="col-span-9">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      className="w-1/2 border border-gray-300 rounded px-3 py-1.5"
                      placeholder="Last Name"
                      value={
                        userData ? userData.first_name : shopData.first_name
                      }
                      onChange={(e) =>
                        handleInputChange("first_name", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className="w-1/2 border border-gray-300 rounded px-3 py-1.5"
                      placeholder="First Name"
                      value={userData ? userData.last_name : shopData.last_name}
                      onChange={(e) =>
                        handleInputChange("last_name", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="mb-3 grid grid-cols-12 items-center">
                <div className="col-span-3 text-right pr-6 text-gray-600">
                  Email
                </div>
                <div className="col-span-9 flex items-center">
                  <span className="mr-4">
                    {userData ? userData.email : shopData.email}
                  </span>
                  <a href="#" className="text-blue-600 text-sm">
                    Change
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="mb-3 grid grid-cols-12 items-center">
                <div className="col-span-3 text-right pr-6 text-gray-600">
                  Phone Number
                </div>
                <div className="col-span-9 flex items-center">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-1.5"
                    placeholder="Phone Number"
                    value={userData ? userData.phone : shopData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="mb-3 grid grid-cols-12 items-center">
                <div className="col-span-3 text-right pr-6 text-gray-600">
                  Gender
                </div>
                <div className="col-span-9">
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={
                          userData
                            ? userData.gender === "male"
                            : shopData.gender === "male"
                        }
                        onChange={() => handleInputChange("gender", "male")}
                        className="mr-2"
                      />
                      Male
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={
                          userData
                            ? userData.gender === "female"
                            : shopData.gender === "female"
                        }
                        onChange={() => handleInputChange("gender", "female")}
                        className="mr-2"
                      />
                      Female
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="other"
                        checked={
                          userData
                            ? userData.gender === "other"
                            : shopData.gender === "other"
                        }
                        onChange={() => handleInputChange("gender", "other")}
                        className="mr-2"
                      />
                      Other
                    </label>
                  </div>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="mb-3 grid grid-cols-12 items-center">
                <div className="col-span-3 text-right pr-6 text-gray-600">
                  Date of Birth
                </div>
                <div className="col-span-9 flex space-x-2">
                  <div className="relative">
                    <select
                      className="appearance-none border border-gray-300 rounded px-3 py-1.5 pr-8 w-28"
                      value={shopData.dob.date}
                      onChange={(e) =>
                        handleInputChange("dob", {
                          ...shopData.dob,
                          date: e.target.value,
                        })
                      }
                    >
                      <option value="">Day</option>
                      {Array.from({ length: 31 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>

                  <div className="relative">
                    <select
                      className="appearance-none border border-gray-300 rounded px-3 py-1.5 pr-8 w-28"
                      value={shopData.dob.month}
                      onChange={(e) =>
                        handleInputChange("dob", {
                          ...shopData.dob,
                          month: e.target.value,
                        })
                      }
                    >
                      <option value="">Month</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>

                  <div className="relative">
                    <select
                      className="appearance-none border border-gray-300 rounded px-3 py-1.5 pr-8 w-28"
                      value={shopData.dob.year}
                      onChange={(e) =>
                        handleInputChange("dob", {
                          ...shopData.dob,
                          year: e.target.value,
                        })
                      }
                    >
                      <option value="">Year</option>
                      {Array.from(
                        { length: 100 },
                        (_, i) => new Date().getFullYear() - i
                      ).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mb-3 grid grid-cols-12 items-center mt-6">
                <div className="col-span-3"></div>
                <div className="col-span-9">
                  <button
                    className={`px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Shop Logo */}
            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-5">
                <img
                  src={shopInfo?.logo || previewUrl}
                  alt="Shop Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="px-4 py-2 bg-gray-200 text-gray-700 rounded cursor-pointer hover:bg-gray-300 mb-2">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                Choose Image
              </label>
              <button
                onClick={handleUploadAvatar}
                disabled={!selectedFile || loading}
                className={`px-4 py-2 bg-blue-500 text-white rounded mb-4 ${
                  !selectedFile || loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-600"
                }`}
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
              <p className="text-gray-500 text-xs mt-1">
                Maximum file size: 1MB
              </p>
              <p className="text-gray-500 text-xs">Format: .JPEG .PNG</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopProfile;
