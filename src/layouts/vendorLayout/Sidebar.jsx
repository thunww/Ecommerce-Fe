import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBox,
  FaClipboardList,
  FaChartBar,
  FaUsers,
  FaDatabase,
  FaStore,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const menuItems = [
  {
    title: "Order Management",
    icon: <FaClipboardList />, 
    submenu: [
      { name: "All Orders", path: "orders" },
      { name: "Bulk Shipping", path: "bulk-shipping" },
      { name: "Order Transfer", path: "order-transfer" },
      { name: "Returns & Cancellations", path: "returns" },
      { name: "Shipping Settings", path: "shipping-settings" },
    ],
  },
  {
    title: "Product Management",
    icon: <FaBox />, 
    submenu: [
      { name: "All Products", path: "products" },
      { name: "Add New Product", path: "products/add" },
    ],
  },
  { title: "Marketing", icon: <FaChartBar />, path: "marketing" },
  { title: "Customer Support", icon: <FaUsers />, path: "customer-support" },
  {
    title: "Finance",
    icon: <FaChartBar />, 
    submenu: [
      { name: "Revenue", path: "revenue" },
      { name: "Shopee Balance", path: "shopee-balance" },
      { name: "Bank Account", path: "bank-account" },
    ],
  },
  { title: "Data", icon: <FaDatabase />, path: "/data" },
  {
    title: "Shop Management",
    icon: <FaStore />, 
    submenu: [
      { name: "Shop Profile", path: "shop-profile" },
      { name: "Shop Decoration", path: "shop-decoration" },
      { name: "Shop Settings", path: "shop-settings" },
    ],
  },
];

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-white shadow-lg border-r flex flex-col">
      {/* Sidebar Title */}
      <div className="pt-16 pb-4 px-4 bg-white shadow-sm">
        <h2 className="text-xl font-bold text-red-600">Owner</h2>
      </div>

      {/* Sidebar Content */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-2">
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.submenu ? (
              <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 rounded-md"
                onClick={() => toggleMenu(item.title)}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.title}</span>
                </div>
                {activeMenu === item.title ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            ) : (
              <Link
                to={item.path}
                className="flex items-center gap-2 p-3 cursor-pointer hover:bg-gray-100 rounded-md"
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            )}
            {activeMenu === item.title && item.submenu && (
              <div className="ml-6 flex flex-col text-sm text-gray-600">
                {item.submenu.map((sub, subIndex) => (
                  <Link key={subIndex} to={sub.path} className="py-1 hover:text-gray-800">
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t text-center text-gray-500 text-sm">© 2025 My App</div>
    </div>
  );
};

export default Sidebar;
