import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart2,
  Settings,
  Truck,
  DollarSign,
  Store,
  MessageSquare,
  FileText,
  Image,
  Folder,
  LogOut,
  Layout,
  ChevronDown,
} from "lucide-react";

const Sidebar = ({ isOpen }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (section) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-50 bg-gray-900 text-white border-r border-gray-800 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } overflow-y-auto`}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-3 p-5 ${
          isOpen ? "" : "justify-center"
        }`}
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
          <img
            src="https://static.vecteezy.com/system/resources/previews/020/429/953/original/admin-icon-vector.jpg"
            alt="Shop Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        {isOpen && <h2 className="text-xl font-bold">E-Admin</h2>}
      </div>

      {/* DASHBOARD Section */}
      <SidebarSection title="Dashboard" isOpen={isOpen}>
        <SidebarItem
          to="/admin"
          icon={<LayoutDashboard size={20} />}
          label="Home"
          isOpen={isOpen}
        />
        <SidebarItem
          to="/admin/overview"
          icon={<BarChart2 size={20} />}
          label="Overview"
          isOpen={isOpen}
        />
        <SidebarItem
          to="/admin/sales"
          icon={<DollarSign size={20} />}
          label="Sales Analytics"
          isOpen={isOpen}
        />
        <SidebarItem
          to="/admin/top-products"
          icon={<Package size={20} />}
          label="Top Products"
          isOpen={isOpen}
        />
        <SidebarItem
          to="/admin/recent-activities"
          icon={<FileText size={20} />}
          label="Recent Activities"
          isOpen={isOpen}
        />
        <SidebarDropdown
          label="Page Layout"
          icon={<Layout size={20} />}
          isOpen={isOpen}
          isExpanded={openDropdown === "page"}
          onClick={() => toggleDropdown("page")}
        >
          <SidebarItem to="/" label="Home" isOpen={isOpen} />
          <SidebarItem
            to="/admin/page-layout/footer"
            label="Footer"
            isOpen={isOpen}
          />
        </SidebarDropdown>
      </SidebarSection>

      {/* MANAGEMENT Section */}
      <SidebarSection title="Management" isOpen={isOpen}>
        <SidebarItem
          to="/admin/users"
          label="Users"
          icon={<Users size={20} />}
          isOpen={isOpen}
        />
        <SidebarItem
          to="/admin/products"
          icon={<Package size={20} />}
          label="Products"
          isOpen={isOpen}
        />
        <SidebarItem
          to="/admin/categories"
          icon={<Folder size={20} />}
          label="Categories"
          isOpen={isOpen}
        />
        <SidebarItem
          to="/admin/shops"
          icon={<Store size={20} />}
          label="Shops"
          isOpen={isOpen}
        />
        <SidebarItem
          to="/admin/shippers"
          icon={<Truck size={20} />}
          label="Shippers"
          isOpen={isOpen}
        />
        <SidebarItem
          to="/admin/transactions"
          icon={<DollarSign size={20} />}
          label="Transactions"
          isOpen={isOpen}
        />
      </SidebarSection>

      {/* CONTENT Section */}
      <SidebarSection title="Content" isOpen={isOpen}>
        <SidebarItem
          to="/admin/chat"
          icon={<MessageSquare size={20} />}
          label="Chat"
          isOpen={isOpen}
        />
        <SidebarItem
          to="/admin/posts"
          icon={<FileText size={20} />}
          label="Posts"
          isOpen={isOpen}
        />
        <SidebarItem
          to="/admin/reviews"
          icon={<MessageSquare size={20} />}
          label="Comments"
          isOpen={isOpen}
        />
        <SidebarItem
          to="/admin/media"
          icon={<Image size={20} />}
          label="Media"
          isOpen={isOpen}
        />
      </SidebarSection>

      {/* ANALYTICS Section */}
      <SidebarSection title="Analytics" isOpen={isOpen}>
        <SidebarItem
          to="/admin/reports"
          icon={<BarChart2 size={20} />}
          label="Reports"
          isOpen={isOpen}
        />
      </SidebarSection>

      {/* SETTINGS Section */}
      <SidebarSection title="Settings" isOpen={isOpen}>
        <SidebarItem
          to="/admin/settings"
          icon={<Settings size={20} />}
          label="Settings"
          isOpen={isOpen}
        />
      </SidebarSection>

      {/* Logout */}
      <div className="mt-auto p-3 bg-gray-800 flex items-center shadow-md transition-all cursor-pointer hover:bg-gray-700">
        <LogOut size={20} className="text-red-500" />
        {isOpen && <span className="ml-3 text-red-500">Logout</span>}
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

const SidebarItem = ({ to, icon, label, isOpen }) => (
  <li>
    <Link
      to={to}
      className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition"
    >
      <div className="flex items-center gap-3">
        {icon} {isOpen && <span>{label}</span>}
      </div>
    </Link>
  </li>
);

const SidebarDropdown = ({
  label,
  icon,
  isOpen,
  isExpanded,
  onClick,
  children,
}) => (
  <li>
    <div
      onClick={onClick}
      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition cursor-pointer"
    >
      <div className="flex items-center gap-3">
        {icon} {isOpen && <span>{label}</span>}
      </div>
      {isOpen && (
        <ChevronDown
          size={16}
          className={`${isExpanded ? "rotate-180" : ""} transition-transform`}
        />
      )}
    </div>
    {isExpanded && <ul className="pl-5 space-y-1">{children}</ul>}
  </li>
);

export default Sidebar;
