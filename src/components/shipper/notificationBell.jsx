import React, { useState, useRef, useEffect } from "react";
import Logo from "./ShipperLogo";
import NotificationBell from "./notificationBell";
import UserMenu from "./UserMenu";

const Header = ({ isOnline, setIsOnline, notifications = [], avatar }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-500 to-red-700 shadow-md text-white relative">
      <Logo />
      <h1 className="text-2xl font-bold tracking-wide">ShipPro</h1>

      <div className="flex items-center space-x-4">
        <NotificationBell notifications={notifications} />

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
