import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Package } from "lucide-react";
import { motion } from "framer-motion";

const SidebarItem = ({ to, icon: Icon, label, onClick, expanded }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center px-6 py-3 transition-all duration-300 ${
        isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"
      }`}
    >
      <Icon className="mr-3" size={20} />
      {expanded && <span className="fade-in">{label}</span>}
    </Link>
  );
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Đóng sidebar khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      {!isOpen && (
        <button
          className="fixed top-1 left-2 z-50 text-gray-800 bg-gray-200 p-2 rounded-md shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={20} />
        </button>
      )}

      {/* Sidebar mở hoàn toàn */}
      <motion.div
        ref={sidebarRef}
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? "0%" : "-100%" }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg z-40"
      >
        <div className="p-5 flex items-center justify-between">
          <h2 className="text-xl font-bold fade-in">Delivery Dashboard</h2>
          <button onClick={() => setIsOpen(false)}>
            <X size={28} />
          </button>
        </div>

        <nav>
          <SidebarItem to="/shipper" icon={Home} label="Dashboard" expanded={true} onClick={() => setIsOpen(false)} />
          <SidebarItem to="/shipper/orders" icon={Package} label="Đơn hàng" expanded={true} onClick={() => setIsOpen(false)} />
        </nav>
      </motion.div>

      {/* Overlay khi Sidebar mở */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
