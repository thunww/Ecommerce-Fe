import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../../redux/authSlice";
import Search from "../Search/Search";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { MdNotificationsNone } from "react-icons/md";
import { fetchAllOrders } from "../../../../redux/orderSlice";

import {
  FaUser,
  FaSignOutAlt,
  FaClipboardList,
  FaShoppingBag,
  FaChevronDown,
  FaChevronUp,
  FaShieldAlt,
  FaStore,
  FaTruck,
} from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import Navigation from "./Navigation";
import MyContext from "../../../../context/MyContext";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Header = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, roles } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.admin.selectedUser);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const menuRef = useRef(null);

  const users = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = users
    ? cartItems.reduce((total, item) => total + item.quantity, 0)
    : 0;

  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const orderCount =
    orders?.reduce((total, order) => {
      return total + (order.subOrders?.length || 0);
    }, 0) || 0;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setShowAccountMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleAccountMenu = () => {
    setShowAccountMenu(!showAccountMenu);
  };

  return (
    <header className="relative">
      <div className="top-strip py-1 border-t-[2px] border-blue-500 bg-blue-600 border-b-[2px]">
        <div className="container px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="col1 w-full sm:w-1/2 overflow-hidden">
              <p className="text-white text-[10px] sm:text-[12px] font-[500] truncate">
                Get up to 50% off new season styles, limited time only.
              </p>
            </div>

            <div className="col2 hidden sm:flex items-center justify-end">
              <ul className="flex items-center gap-2 sm:gap-3">
                <li className="list-none">
                  <Link
                    to="/help-center"
                    className="text-white text-[10px] sm:text-[12px] link font-[500] transition"
                  >
                    Help Center
                  </Link>
                </li>
                <li className="list-none">
                  <Link
                    to="/order-tracking"
                    className="text-white text-[10px] sm:text-[12px] link font-[500] transition"
                  >
                    Order Tracking
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="header py-2 sm:py-3 border-b-[2px] border-blue-500">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Logo */}
            <div className="w-[120px] sm:w-[150px] flex-shrink-0">
              <Link to="/" className="logo block">
                <img
                  src="/logo.jpg"
                  alt="logo"
                  className="max-h-10 sm:max-h-12 w-auto"
                />
              </Link>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1 sm:gap-3 order-2 sm:order-3">
              <ul className="flex items-center gap-3 sm:gap-6">
                <li>
                  <Tooltip title="Cart">
                    <IconButton
                      aria-label="cart"
                      onClick={() => navigate("/cart")}
                      size="small"
                      className="p-1 sm:p-2"
                    >
                      <StyledBadge badgeContent={cartCount} color="secondary">
                        <MdOutlineShoppingCart className="text-base sm:text-lg" />
                      </StyledBadge>
                    </IconButton>
                  </Tooltip>
                </li>
                <li>
                  <Tooltip title="Wishlist">
                    <IconButton
                      aria-label="wishlist"
                      size="small"
                      className="p-1 sm:p-2"
                    >
                      <StyledBadge color="secondary">
                        <FaRegHeart className="text-base sm:text-lg" />
                      </StyledBadge>
                    </IconButton>
                  </Tooltip>
                </li>
                <li>
                  <Tooltip title="Notification">
                    <IconButton
                      aria-label="notification"
                      size="small"
                      className="p-1 sm:p-2"
                    >
                      <StyledBadge badgeContent={10} color="secondary">
                        <MdNotificationsNone className="text-base sm:text-lg" />
                      </StyledBadge>
                    </IconButton>
                  </Tooltip>
                </li>

                {isAuthenticated ? (
                  <li className="list-none relative" ref={menuRef}>
                    <button
                      onClick={toggleAccountMenu}
                      className="flex items-center gap-1 sm:gap-2 text-black text-[12px] sm:text-[14px] link font-[500] transition"
                    >
                      <div className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 overflow-hidden rounded-full border border-gray-200">
                        <img
                          src={
                            user?.profile_picture ||
                            "https://th.bing.com/th/id/OIP.ByNwhzY5vUBvdIEfMCqDogHaHa?rs=1&pid=ImgDetMain"
                          }
                          alt="Avatar"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://th.bing.com/th/id/OIP.ByNwhzY5vUBvdIEfMCqDogHaHa?rs=1&pid=ImgDetMain";
                          }}
                        />
                      </div>
                      <span className="truncate max-w-[40px] xs:max-w-[80px] sm:max-w-none">
                        My Account
                      </span>
                      {showAccountMenu ? (
                        <FaChevronUp className="text-xs flex-shrink-0" />
                      ) : (
                        <FaChevronDown className="text-xs flex-shrink-0" />
                      )}
                    </button>

                    {showAccountMenu && (
                      <div className="absolute right-0 mt-2 w-[220px] bg-white border border-gray-200 rounded-md shadow-lg z-50 max-w-[calc(100vw-2rem)]">
                        <div className="py-3 px-4 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {user
                              ? `${user.first_name || ""} ${
                                  user.last_name || ""
                                }`.trim()
                              : "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email || "user@example.com"}
                          </p>
                        </div>
                        <ul>
                          <li>
                            <Link
                              to="/my-account"
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 w-full text-left"
                              onClick={() => setShowAccountMenu(false)}
                            >
                              <FaUser className="text-blue-500 flex-shrink-0" />
                              <span className="truncate">My Profile</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/my-account/orders"
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 w-full text-left"
                              onClick={() => setShowAccountMenu(false)}
                            >
                              <FaShoppingBag className="text-blue-500 flex-shrink-0" />
                              <span className="truncate">My Orders</span>
                            </Link>
                          </li>

                          {roles.includes("admin") && (
                            <li>
                              <Link
                                to="/admin"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 w-full text-left"
                                onClick={() => setShowAccountMenu(false)}
                              >
                                <FaShieldAlt className="text-blue-500 flex-shrink-0" />
                                <span className="truncate">
                                  Admin Dashboard
                                </span>
                              </Link>
                            </li>
                          )}
                          {roles.includes("vendor") && (
                            <li>
                              <Link
                                to="/vendor"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 w-full text-left"
                                onClick={() => setShowAccountMenu(false)}
                              >
                                <FaStore className="text-blue-500 flex-shrink-0" />
                                <span className="truncate">
                                  Vendor Dashboard
                                </span>
                              </Link>
                            </li>
                          )}
                          {roles.includes("shipper") && (
                            <li>
                              <Link
                                to="/shipper"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 w-full text-left"
                                onClick={() => setShowAccountMenu(false)}
                              >
                                <FaTruck className="text-blue-500 flex-shrink-0" />
                                <span className="truncate">
                                  Shipper Dashboard
                                </span>
                              </Link>
                            </li>
                          )}
                          <li className="border-t border-gray-100 mt-1">
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                            >
                              <FaSignOutAlt className="text-red-500 flex-shrink-0" />
                              <span className="truncate">Logout</span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                ) : (
                  <li className="list-none">
                    <div className="flex items-center text-[11px] sm:text-[14px]">
                      <Link
                        to="/login"
                        className="text-black link font-[500] transition"
                      >
                        Login
                      </Link>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {/* Search */}
            <div className="w-full sm:w-auto sm:flex-1 order-3 sm:order-2 sm:mx-4">
              <Search />
            </div>
          </div>
        </div>
      </div>

      <Navigation />
    </header>
  );
};

export default Header;
