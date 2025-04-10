import React, { useState, useEffect, useRef } from "react";
import {
  FaTh,
  FaUserCircle,
  FaStore,
  FaCog,
  FaGlobe,
  FaSignOutAlt,
  FaShoppingCart,
  FaBox,
  FaChartLine,
  FaMoneyBillWave,
  FaTools,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import Logo from "../../assets/image/logo.jpg";

// Hàm xử lý breadcrumb từ URL
const getBreadcrumbTitle = (pathname) => {
  const mapping = {
    orders: "All Orders",
    "bulk-shipping": "Bulk Shipping",
    "order-transfer": "Order Transfer",
    returns: "Returns & Cancellations",
    "shipping-settings": "Shipping Settings",
    products: "All Products",
    "add-product": "Add New Product",
    marketing: "Marketing",
    "customer-support": "Customer Support",
    revenue: "Revenue",
    "shopee-balance": "Shopee Balance",
    "bank-account": "Bank Account",
    data: "Data",
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const breadcrumb = getBreadcrumbTitle(location.pathname);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Lấy thông tin user và roles từ Redux store
  const { user, roles } = useSelector((state) => state.auth);

  // URL avatar mặc định
  const defaultAvatar =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTC5qazavqTLCrmQCDwfMAdvNEE8Xa7pSzSw&s";

  // Tạo ref cho các menu
  const mainMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Kiểm tra click có phải bên ngoài main menu không
      if (mainMenuRef.current && !mainMenuRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      // Kiểm tra click có phải bên ngoài profile menu không
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    // Thêm event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Hàm xử lý khi click vào menu chính
  const handleMainMenuClick = () => {
    setDropdownOpen(!isDropdownOpen);
    setProfileDropdownOpen(false);
  };

  // Hàm xử lý khi click vào menu profile
  const handleProfileMenuClick = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
    setDropdownOpen(false);
  };

  // Hàm xử lý khi click vào avatar
  const handleAvatarClick = () => {
    // Chỉ mở dropdown menu, không điều hướng đến trang profile
    setProfileDropdownOpen(!isProfileDropdownOpen);
    setDropdownOpen(false);
  };

  // Hàm xử lý khi click vào các mục menu
  const handleMenuItemClick = () => {
    setDropdownOpen(false);
    setProfileDropdownOpen(false);
  };

  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
    try {
      // Đóng dropdown menu
      setProfileDropdownOpen(false);

      // Xóa token và thông tin user từ localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("roles");

      // Gọi action logout từ Redux
      await dispatch(logout()).unwrap();

      // Chuyển hướng về trang login
      navigate("/login");
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow border-b h-16 flex justify-between items-center px-6">
      {/* Logo, Title & Breadcrumb */}
      <div className="flex items-center gap-2">
        <img src={Logo} alt="Logo" className="h-12 w-32 object-contain" />
        <Link
          to="/vendor"
          className="text-lg font-semibold hover:text-red-600 transition duration-300"
        >
          Seller Center
        </Link>
        {breadcrumb !== "Dashboard" && (
          <span className="text-gray-600 text-sm font-medium">
            {" "}
            &gt; {breadcrumb}
          </span>
        )}
      </div>

      {/* Icons & User Info */}
      <div className="relative flex items-center gap-4">
        {/* Menu Button and Dropdown */}
        <div ref={mainMenuRef}>
          <FaTh
            className="text-gray-500 text-xl cursor-pointer"
            onClick={handleMainMenuClick}
          />

          {/* Main Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-10 right-0 bg-white shadow-md rounded-lg p-3 w-48">
              <Link
                to="/vendor/orders"
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
                onClick={handleMenuItemClick}
              >
                <FaShoppingCart className="text-gray-500" />
                <span>All Orders</span>
              </Link>
              <Link
                to="/vendor/products"
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
                onClick={handleMenuItemClick}
              >
                <FaBox className="text-gray-500" />
                <span>All Products</span>
              </Link>
              <Link
                to="/vendor/marketing"
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
                onClick={handleMenuItemClick}
              >
                <FaChartLine className="text-gray-500" />
                <span>Marketing Channels</span>
              </Link>
              <Link
                to="/vendor/revenue"
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
                onClick={handleMenuItemClick}
              >
                <FaMoneyBillWave className="text-gray-500" />
                <span>Revenue Analytics</span>
              </Link>
              <Link
                to="/vendor/shop-settings"
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
                onClick={handleMenuItemClick}
              >
                <FaTools className="text-gray-500" />
                <span>Shop Settings</span>
              </Link>
            </div>
          )}
        </div>

        {/* Profile Avatar & Dropdown */}
        <div ref={profileMenuRef} className="relative">
          {user && user.profile_picture ? (
            <img
              src={user.profile_picture}
              alt={user.username || "User Profile"}
              className="w-8 h-8 rounded-full cursor-pointer object-cover"
              onClick={handleAvatarClick}
            />
          ) : (
            <img
              src={defaultAvatar}
              alt="User Profile"
              className="w-8 h-8 rounded-full cursor-pointer object-cover"
              onClick={handleAvatarClick}
            />
          )}

          {/* Profile Dropdown Menu */}
          {isProfileDropdownOpen && (
            <div className="absolute top-10 right-0 bg-white shadow-md rounded-lg w-48">
              {/* Thông tin người dùng */}
              {user && (
                <div className="px-4 py-2 border-b">
                  {/* <p className="font-semibold">{user.username || 'User'}</p> */}
                  {roles && roles.length > 0 && (
                    <div className="mt-1">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full capitalize">
                        {roles[1]}
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 truncate">
                    {user.email || ""}
                  </p>
                </div>
              )}

              <div className="py-1">
                <Link
                  to="/vendor/shop/profile"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
                  onClick={handleMenuItemClick}
                >
                  <FaUserCircle className="text-gray-500" />
                  <span>My Profile</span>
                </Link>
                <Link
                  to="/vendor/shop/profile"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
                  onClick={handleMenuItemClick}
                >
                  <FaStore className="text-gray-500" />
                  <span>Shop Information</span>
                </Link>
                <Link
                  to="/vendor/shop-settings"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
                  onClick={handleMenuItemClick}
                >
                  <FaCog className="text-gray-500" />
                  <span>Shop Setting</span>
                </Link>
                <Link
                  to="/vendor/language"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
                  onClick={handleMenuItemClick}
                >
                  <FaGlobe className="text-gray-500" />
                  <span>English</span>
                </Link>
                <div
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="text-red-600" />
                  <span>Logout</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
