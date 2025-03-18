import React from "react";
import { FaTh, FaUserCircle } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/image/logo.jpg";

// Hàm xử lý breadcrumb từ URL
const getBreadcrumbTitle = (pathname) => {
  const mapping = {
    "orders": "All Orders",
    "bulk-shipping": "Bulk Shipping",
    "order-transfer": "Order Transfer",
    "returns": "Returns & Cancellations",
    "shipping-settings": "Shipping Settings",
    "products": "All Products",
    "add-product": "Add New Product",
    "marketing": "Marketing",
    "customer-support": "Customer Support",
    "revenue": "Revenue",
    "shopee-balance": "Shopee Balance",
    "bank-account": "Bank Account",
    "data": "Data",
    "shop-profile": "Shop Profile",
    "shop-decoration": "Shop Decoration",
    "shop-settings": "Shop Settings",
  };

  const parts = pathname.split("/").filter((part) => part !== ""); 
  const lastPart = parts[parts.length - 1]; 
  return mapping[lastPart] || "Dashboard"; 
};

const Header = () => {
  const location = useLocation();
  const breadcrumb = getBreadcrumbTitle(location.pathname);

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow border-b h-16 flex justify-between items-center px-6">
      {/* Logo, Title & Breadcrumb */}
      <div className="flex items-center gap-2">
        <img src={Logo} alt="Logo" className="h-12 w-32 object-contain" />
        <Link to="/vendor" className="text-lg font-semibold hover:text-red-600 transition duration-300">
          Seller Center
        </Link>
        {breadcrumb !== "Dashboard" && (
          <span className="text-gray-600 text-sm font-medium"> &gt; {breadcrumb}</span>
        )}
      </div>

      {/* Icons & User Info */}
      <div className="flex items-center gap-4">
        <FaTh className="text-gray-500 text-xl cursor-pointer" />
        <FaUserCircle className="text-gray-500 text-2xl cursor-pointer" />
      </div>
    </div>
  );
};

export default Header;
