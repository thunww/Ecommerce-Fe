import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ isOnline, setIsOnline, notifications = [] }) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem("profileData");
    if (savedProfile) {
      const { avatar } = JSON.parse(savedProfile);
      setAvatar(avatar);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-500 to-red-700 shadow-md text-white relative">
      {/* Logo */}
      <div className="ml-4 flex items-center">
        <img
          src="https://img.freepik.com/premium-vector/cute-courier-delivery-package-cartoon-vector_941466-7880.jpg"
          alt="Logo"
          className="h-16 w-auto"
        />
      </div>

      {/* Tiêu đề */}
      <h1 className="text-2xl font-bold tracking-wide">ShipPro</h1>

      <div className="flex items-center space-x-4">

        {/* Notification Bell */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative p-2 bg-white text-gray-700 rounded-full"
          >
            🔔
            {Array.isArray(notifications) && notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Dropdown Thông báo */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white text-black shadow-lg rounded-lg p-4 z-50">
              <h3 className="text-sm font-semibold border-b pb-2">Thông báo</h3>
              {Array.isArray(notifications) && notifications.length === 0 ? (
                <p className="text-xs text-gray-500 mt-2">Không có thông báo nào</p>
              ) : (
                <ul className="mt-2 space-y-2 max-h-40 overflow-auto">
                  {notifications.map((notification, index) => (
                    <li key={index} className="text-xs text-gray-700 border-b pb-2 last:border-none">
                      {notification}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* User Profile & Logout */}
        <div className="relative" ref={userMenuRef}>
          <button onClick={() => setShowUserMenu((prev) => !prev)} className="p-2 rounded-full">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-white" />
            ) : (
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                ?
              </div>
            )}
          </button>
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg p-2 z-50">
              <button
                onClick={() => {
                  navigate("/shipper/profile");
                  setShowUserMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Xem hồ sơ
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  // Thêm logic đăng xuất nếu cần
                }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
