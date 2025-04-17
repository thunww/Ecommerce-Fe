import { useState } from "react";
import {
  Bell,
  Search,
  Sun,
  Moon,
  LogOut,
  User,
  Menu,
  Home,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
const Header = ({ onMenuClick }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="p-4 bg-gray-900 text-white shadow-md flex items-center gap-4">
      {/* Nút mở Sidebar (☰) */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-xl hover:bg-gray-800 transition-all"
      >
        <Menu size={26} />
      </button>

      {/* Icon Home */}
      <button
        className="p-2 rounded-xl hover:bg-gray-800 transition-all"
        onClick={() => navigate("/admin")} // Chuyển hướng đến trang chủ
      >
        <Home size={24} />
      </button>

      {/* Thanh tìm kiếm */}
      <div className="relative hidden md:block w-80">
        <input
          type="text"
          placeholder="Search..."
          className="pl-10 pr-4 py-2 w-full rounded-xl bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
      </div>

      {/* Thông tin khác */}
      <div className="ml-auto flex items-center gap-6">
        {/* Chế độ Dark Mode */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl hover:bg-gray-800 transition-all"
        >
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        {/* Thông báo */}
        <button className="relative p-2 rounded-xl hover:bg-gray-800 transition-all">
          <Bell size={24} />
          <span className="absolute top-1 right-1 bg-red-500 w-3 h-3 rounded-full animate-pulse"></span>
        </button>

        {/* Cài đặt */}
        <button className="p-2 rounded-xl hover:bg-gray-800 transition-all">
          <Settings size={24} />
        </button>

        {/* Avatar với dropdown menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-800 transition-all"
          >
            <img
              src="https://th.bing.com/th/id/OIP.Bx50pdKGdNdT8pjhKVjn-QHaHa?rs=1&pid=ImgDetMain"
              alt="Avatar"
              className="w-10 h-10 rounded-full border-2 border-blue-500"
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg w-44 z-10 transition-all transform origin-top-right scale-95">
              <button className="flex items-center p-3 hover:bg-gray-100 w-full transition">
                <User className="mr-2" size={18} /> Profile
              </button>
              <button className="flex items-center p-3 hover:bg-gray-100 w-full transition">
                <LogOut className="mr-2" size={18} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
