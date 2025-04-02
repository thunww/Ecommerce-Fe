import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaChevronDown } from 'react-icons/fa';
import { useUser } from '../contexts/UserContext';
import ShipperLogo from './ShipperLogo';

const ShipperHeader = ({ onMenuClick }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { userInfo } = useUser();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-[#F84C4C] text-white shadow-md">
      <div className="flex items-center justify-between h-16">
        {/* Left section */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="md:hidden text-white focus:outline-none px-4"
          >
            <FaBars size={24} />
          </button>
          <div className="flex items-center gap-2 px-4">
            <ShipperLogo className="w-8 h-8" />
            <span className="text-xl font-bold">ShipPro</span>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4 px-4">
          {/* Online status button */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
              isOnline ? 'bg-green-500' : 'bg-gray-500'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-white' : 'bg-gray-300'}`} />
            <span>Online</span>
          </button>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-white">
                <img
                  src={userInfo?.avatar || "/default-avatar.jpg"}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="hidden md:block">{userInfo?.name || "User"}</span>
              <FaChevronDown size={12} />
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link
                  to="/shipper/profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Thông tin cá nhân
                </Link>
                <button
                  onClick={() => {/* Handle logout */}}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ShipperHeader; 