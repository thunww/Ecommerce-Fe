import React from "react";
import { Link } from "react-router-dom";
import { 
  Home, 
  Package, 
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LineChart
} from "lucide-react";

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

const ShipperSidebar = ({ isOpen, toggleSidebar, currentPath, isCollapsed, toggleCollapse }) => {
  const menuItems = [
    { to: "/shipper/dashboard", icon: Home, label: "Dashboard" },
    { to: "/shipper/orders", icon: Package, label: "Đơn hàng" },
    { to: "/shipper/income", icon: LineChart, label: "Thu nhập" },
    { to: "/shipper/profile", icon: User, label: "Thông tin" }
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 ${isCollapsed ? "w-16" : "w-64"}`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 bg-red-500 text-white px-4">
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
          <SidebarItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            isActive={currentPath === item.to}
            onClick={toggleSidebar}
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
          className={`flex items-center text-red-600 hover:bg-red-50 transition-colors duration-200 px-4 py-3 w-full ${
            isCollapsed ? "justify-center" : ""
          }`}
          title={isCollapsed ? "Đăng xuất" : ""}
        >
          <LogOut className={isCollapsed ? "" : "mr-3"} size={20} />
          {!isCollapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
};

export default ShipperSidebar;
