import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Import icons

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Nút mở Sidebar (ẩn khi Sidebar mở) */}
      {!isOpen && (
        <button 
          className="fixed top-2 left-2 z-50 text-gray-800 bg-gray-200 p-2 rounded-md shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={28} />
        </button>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white w-64 shadow-lg z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-64"}`}
      >
        <div className="p-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">Delivery Dashboard</h2>
          {/* Nút đóng Sidebar */}
          <button onClick={() => setIsOpen(false)}>
            <X size={28} />
          </button>
        </div>

        <nav>
          <Link to="/" className="block px-6 py-3 hover:bg-gray-700">🏠 Dashboard</Link>
          <Link to="/orders" className="block px-6 py-3 hover:bg-gray-700">📦 Đơn hàng</Link>
          <Link to="/profile" className="block px-6 py-3 hover:bg-gray-700">👤 Hồ sơ</Link>
        </nav>
      </div>

      {/* Overlay mờ khi Sidebar mở */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
