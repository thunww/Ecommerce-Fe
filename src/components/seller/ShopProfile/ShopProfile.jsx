import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";

const ShopProfile = () => {
  const [loading, setLoading] = useState(false);

  const [shopData, setShopData] = useState({
    username: "charlie",
    name: "",
    email: "n2*******@student.ptithcm.edu.vn",
    phone: "*********71",
    gender: "male",
    dob: { date: "", month: "", year: "" },
    avatar_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTC5qazavqTLCrmQCDwfMAdvNEE8Xa7pSzSw&s",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(shopData.avatar_url);

  const handleInputChange = (field, value) => {
    setShopData({
      ...shopData,
      [field]: value,
    });
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Cập nhật thông tin thành công!");
    }, 1000);
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

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md  h-fit ">
        <div className="p-4 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
            <img
              src={previewUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-base font-medium">Charlie</div>
          <button className="flex items-center text-gray-500 text-xs mt-1">
            <FaEdit className="mr-1" size={12} /> Edit Profile
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
            <div className="py-1">Banks & Cards</div>
            <div className="py-1">Addresses</div>
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
            <span>My Purchase</span>
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
            <span>My Shopee Coins</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white m-6 shadow-sm overflow-auto h-fit max-h-[calc(100vh-4rem)]">
        <div className="p-5">
          <div className="mb-3">
            <h1 className="text-xl font-medium">My Profile</h1>
            <p className="text-gray-600 text-sm">
              Manage and protect your account
            </p>
          </div>

          <div className="flex flex-wrap">
            {/* Left Column - Form */}
            <div className="w-full lg:w-2/3 pr-0 lg:pr-10">
              {/* Username */}
              <div className="mb-3 grid grid-cols-12 items-center">
                <div className="col-span-3 text-right pr-6 text-gray-600">
                  Username
                </div>
                <div className="col-span-9">{shopData.username}</div>
              </div>

              {/* Name */}
              <div className="mb-3 grid grid-cols-12 items-center">
                <div className="col-span-3 text-right pr-6 text-gray-600">
                  Name
                </div>
                <div className="col-span-9">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-1.5"
                    placeholder=""
                    value={shopData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-3 grid grid-cols-12 items-center">
                <div className="col-span-3 text-right pr-6 text-gray-600">
                  Email
                </div>
                <div className="col-span-9 flex items-center">
                  <span className="mr-4">{shopData.email}</span>
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
                  <span className="mr-4">{shopData.phone}</span>
                  <a href="#" className="text-blue-600 text-sm">
                    Change
                  </a>
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
                        checked={shopData.gender === "male"}
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
                        checked={shopData.gender === "female"}
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
                        checked={shopData.gender === "other"}
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
                  Date of birth
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
                      <option value="">Date</option>
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
              <div className="mb-3 grid grid-cols-12 mt-3">
                <div className="col-span-3"></div>
                <div className="col-span-9">
                  <button
                    onClick={handleSave}
                    className="px-5 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    disabled={loading}
                  >
                    {loading ? "Đang lưu..." : "Save"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Avatar */}
            <div className="w-full lg:w-1/3 flex flex-col items-center mt-4 lg:mt-0">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-3">
                <img
                  src={previewUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <button
                className="mb-2 px-3 py-1.5 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 text-sm"
                onClick={() => document.getElementById("avatarInput").click()}
              >
                Select Image
              </button>
              <input
                id="avatarInput"
                type="file"
                accept="image/jpeg, image/png"
                className="hidden"
                onChange={handleImageChange}
              />

              <div className="text-xs text-gray-500 text-center">
                <p>File size: maximum 1 MB</p>
                <p>File extension: .JPEG, .PNG</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopProfile;
