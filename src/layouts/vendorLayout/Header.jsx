import React, { Component } from "react";
import { FaTh, FaUserCircle } from "react-icons/fa";
import Logo from '../../assets/image/logo.jpg';

class Header extends Component {
  render() {
    return (
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow border-b h-16 flex justify-between items-center px-6">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <img src={Logo} alt="Logo" className="h-12 w-32 object-contain" />
          <h1 className="text-lg font-semibold">Seller Center</h1>
        </div>

        {/* Icons & User Info */}
        <div className="flex items-center gap-4">
          <FaTh className="text-gray-500 text-xl cursor-pointer" />
          <FaUserCircle className="text-gray-500 text-2xl cursor-pointer" />
        </div>
      </div>
    );
  }
}

export default Header;
