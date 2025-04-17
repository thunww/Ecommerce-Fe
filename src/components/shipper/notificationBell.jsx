import React, { useState, useRef, useEffect } from "react";
import Logo from "./ShipperLogo";
import NotificationBell from "./notificationBell";
import UserMenu from "./UserMenu";
import { useDispatch, useSelector } from 'react-redux';
import {
  getNotifications,
  markNotificationAsRead,
  getUnreadNotificationCount
} from '../../redux/shipperSlice';
import { BellIcon } from '@heroicons/react/24/outline';

const Header = ({ isOnline, setIsOnline, notifications = [], avatar }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const { unreadNotificationCount, loading } = useSelector((state) => state.shipper);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    dispatch(getNotifications());
    dispatch(getUnreadNotificationCount());
  }, [dispatch]);

  const handleMarkAsRead = async (notificationId) => {
    await dispatch(markNotificationAsRead(notificationId));
    dispatch(getUnreadNotificationCount());
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-500 to-red-700 shadow-md text-white relative">
      <Logo />
      <h1 className="text-2xl font-bold tracking-wide">ShipPro</h1>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <BellIcon className="h-6 w-6" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {showMenu && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50"
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Thông báo</h3>
                {loading ? (
                  <div className="text-center py-4">Đang tải...</div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">Không có thông báo mới</div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg ${
                          !notification.read ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{notification.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDate(notification.created_at)}
                            </p>
                          </div>
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-blue-500 hover:text-blue-700 text-sm"
                            >
                              Đánh dấu đã đọc
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Avatar & Dropdown Menu */}
        <div className="relative">
          <button onClick={() => setShowMenu((prev) => !prev)}>
            <img
              src={avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-white hover:scale-105 transition-all"
            />
          </button>

          {showMenu && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg fade-in text-gray-800"
            >
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                Xem hồ sơ
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
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
