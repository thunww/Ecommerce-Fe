import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, Users, Package, ShoppingCart, Calendar, Mail, FileText, Ticket, 
  MessageCircle, Kanban, Box, Globe, Menu 
} from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gray-900 text-white shadow-lg transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 p-5 ${isOpen ? "" : "justify-center"}`}>
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-lg font-bold">M</span>
        </div>
        {isOpen && <h2 className="text-xl font-bold">Modernize</h2>}
      </div>

      {/* HOME Section */}
      <SidebarSection title="Home" isOpen={isOpen}>
        <SidebarItem to="/admin" icon={<Globe size={20} />} label="Modern" isOpen={isOpen} isNew />
        <SidebarItem to="/admin/ecommerce" icon={<ShoppingCart size={20} />} label="eCommerce" isOpen={isOpen} />
        <SidebarItem to="/admin/pages" icon={<LayoutDashboard size={20} />} label="Frontend pages" isOpen={isOpen} hasDropdown />
      </SidebarSection>

      {/* APPS Section */}
      <SidebarSection title="Apps" isOpen={isOpen}>
        <SidebarItem to="/admin/contacts" icon={<Box size={20} />} label="Contacts" isOpen={isOpen} notification={2} />
        <SidebarItem to="/admin/blog" icon={<FileText size={20} />} label="Blog" isOpen={isOpen} hasDropdown />
        <SidebarItem to="/admin/ecommerce" icon={<Package size={20} />} label="Ecommerce" isOpen={isOpen} hasDropdown />
        <SidebarItem to="/admin/chats" icon={<MessageCircle size={20} />} label="Chats" isOpen={isOpen} />
        <SidebarItem to="/admin/users" icon={<Users size={20} />} label="Users" isOpen={isOpen} hasDropdown />
        <SidebarItem to="/admin/notes" icon={<FileText size={20} />} label="Notes" isOpen={isOpen} />
        <SidebarItem to="/admin/calendar" icon={<Calendar size={20} />} label="Calendar" isOpen={isOpen} />
        <SidebarItem to="/admin/email" icon={<Mail size={20} />} label="Email" isOpen={isOpen} />
        <SidebarItem to="/admin/tickets" icon={<Ticket size={20} />} label="Tickets" isOpen={isOpen} />
        <SidebarItem to="/admin/kanban" icon={<Kanban size={20} />} label="Kanban" isOpen={isOpen} />
      </SidebarSection>

      {/* User Profile */}
      <div className={`absolute bottom-5 left-0 right-0 p-3 bg-gray-800 flex items-center shadow-md transition-all ${isOpen ? "gap-3" : "justify-center"}`}>
        <img src="https://via.placeholder.com/40" alt="User" className="w-10 h-10 rounded-full" />
        {isOpen && (
          <div className="flex-1">
            <h4 className="font-semibold text-white">Mathew</h4>
            <p className="text-sm text-gray-400">Designer</p>
          </div>
        )}
        <button className="text-blue-400 hover:text-blue-300">
          ⏻
        </button>
      </div>
    </aside>
  );
};

const SidebarSection = ({ title, isOpen, children }) => (
  <div className="p-3">
    {isOpen && <p className="text-gray-400 text-xs uppercase mb-2">{title}</p>}
    <ul className="space-y-1">{children}</ul>
  </div>
);

const SidebarItem = ({ to, icon, label, isOpen, isNew, hasDropdown, notification }) => (
  <li>
    <Link
      to={to}
      className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition"
    >
      <div className="flex items-center gap-3">
        {icon}
        {isOpen && <span>{label}</span>}
      </div>
      {isNew && isOpen && <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-lg">New</span>}
      {notification && isOpen && (
        <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">{notification}</span>
      )}
      {hasDropdown && isOpen && <span className="text-gray-400">▼</span>}
    </Link>
  </li>
);

export default Sidebar;
