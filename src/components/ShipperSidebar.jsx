const ShipperSidebar = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-[#F84C4C] w-64 text-white transform transition-transform duration-300 ease-in-out z-40 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Close button for mobile */}
      <button
        onClick={onClose}
        className="md:hidden absolute top-4 right-4 text-white"
      >
        <FaTimes size={24} />
      </button>

      {/* Sidebar content */}
      <div className="flex flex-col h-full">
        {/* Logo section */}
        <div className="flex items-center gap-2 p-4 bg-[#F84C4C]">
          <img src="/logo.png" alt="ShipPro" className="w-8 h-8" />
          <span className="text-xl font-bold">ShipPro</span>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 py-4">
          <NavLink
            to="/shipper/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 transition-colors ${
                isActive
                  ? "bg-[#F84C4C] text-white"
                  : "text-white hover:bg-[#FF6B6B]"
              }`
            }
          >
            <FaHome size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/shipper/orders"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 transition-colors ${
                isActive
                  ? "bg-[#F84C4C] text-white"
                  : "text-white hover:bg-[#FF6B6B]"
              }`
            }
          >
            <FaBox size={20} />
            <span>Đơn hàng</span>
          </NavLink>

          <NavLink
            to="/shipper/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 transition-colors ${
                isActive
                  ? "bg-[#F84C4C] text-white"
                  : "text-white hover:bg-[#FF6B6B]"
              }`
            }
          >
            <FaUser size={20} />
            <span>Thông tin cá nhân</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
}; 