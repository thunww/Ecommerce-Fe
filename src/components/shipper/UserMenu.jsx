import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserMenu = () => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const userMenuRef = useRef(null);

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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
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
  );
};

export default UserMenu;
