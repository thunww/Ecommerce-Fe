import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Package, 
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LineChart
} from "lucide-react";
import { FaHome, FaClipboardList, FaUser, FaMoneyBillWave, FaSignOutAlt, FaStore } from 'react-icons/fa';

const SidebarItem = ({ to, icon: Icon, label, isActive, onClick, isCollapsed }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors duration-200 ${
        isActive ? "bg-red-500 text-white" : "text-gray-600 hover:bg-red-50"
      }`}
      title={isCollapsed ? label : ""}
    >
      <Icon className={isCollapsed ? "mx-auto" : "mr-3"} size={20} />
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );
};

const MenuItem = ({ to, icon: Icon, label, isActive, isCollapsed }) => (
  <Link
    to={to}
    className={`relative flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} px-4 py-3 text-sm hover:bg-red-50 hover:text-red-500 transition-colors group ${
      isActive ? 'bg-red-50 text-red-500 border-r-4 border-red-500' : 'text-gray-600'
    }`}
  >
    <Icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : ''}`} />
    {!isCollapsed && <span>{label}</span>}
    
    {/* Tooltip khi hover */}
    {isCollapsed && (
      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap">
        {label}
      </div>
    )}
  </Link>
);

const ShipperSidebar = ({ isOpen, toggleSidebar, currentPath, isCollapsed, toggleCollapse }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { to: "/shipper/dashboard", icon: FaHome, label: "Trang chủ" },
    { to: "/shipper/orders", icon: FaClipboardList, label: "Đơn hàng" },
    { to: "/shipper/income", icon: FaMoneyBillWave, label: "Thu nhập" },
    { to: "/shipper/profile", icon: FaUser, label: "Hồ sơ" },
    { to: "/", icon: FaStore, label: "Trang khách hàng" }
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 ${isCollapsed ? "w-16" : "w-64"}`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-[4.5rem] bg-red-500 text-white px-4">
        {!isCollapsed && <h1 className="text-xl font-bold">ShipPro</h1>}
        <button
          onClick={toggleCollapse}
          className="p-1 hover:bg-red-600 rounded-lg transition-colors duration-200 hidden md:block"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="mt-4">
        {menuItems.map((item) => (
          <MenuItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            isActive={isActive(item.to)}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-0 w-full p-4 border-t">
        <button
          onClick={() => {
            // TODO: Implement logout
            console.log("Logout clicked");
            toggleSidebar();
          }}
          className={`relative flex items-center text-red-600 hover:bg-red-50 transition-colors duration-200 px-4 py-3 w-full group ${
            isCollapsed ? "justify-center" : "space-x-2"
          }`}
        >
          <FaSignOutAlt className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : ''}`} />
          {!isCollapsed && <span>Đăng xuất</span>}
          
          {/* Tooltip cho nút đăng xuất */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap">
              Đăng xuất
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default ShipperSidebar;
