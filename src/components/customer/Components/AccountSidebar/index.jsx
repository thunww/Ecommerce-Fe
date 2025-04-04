import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../../redux/authSlice";
import { MdOutlineDashboard } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { MdOutlineLogout } from "react-icons/md";
import { fetchUserById } from "../../../../redux/adminSlice";

const AccountSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.auth.user?.user_id); // Lấy user_id từ auth state
  const user = useSelector((state) => state.admin.selectedUser);

  // Fetch user khi dashboard được load
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
    }
  }, [dispatch, userId]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="account-sidebar bg-white shadow-md rounded-md overflow-hidden">
      {/* User Profile Section */}
      <div className="user-profile p-4 sm:p-5 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <div className="flex flex-col items-center">
          <div className="avatar mb-2 sm:mb-3 relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-full border-4 border-white">
              <img
                src={user?.profile_picture || "/avatar.jpg"}
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/avatar.jpg";
                }}
              />
            </div>
          </div>
          <h3 className="text-base sm:text-lg font-semibold truncate max-w-full">
            {user
              ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
              : "Người dùng"}
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 truncate max-w-full">
            {user?.email || "user@example.com"}
          </p>
        </div>
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-blue-400">
          <div className="flex justify-between text-center text-xs">
            <div className="px-1">
              <p className="font-bold text-lg sm:text-xl">0</p>
              <p className="text-xs">Đơn hàng</p>
            </div>
            <div className="px-1">
              <p className="font-bold text-lg sm:text-xl">0</p>
              <p className="text-xs">Yêu thích</p>
            </div>
            <div className="px-1">
              <p className="font-bold text-lg sm:text-xl">0</p>
              <p className="text-xs">Đánh giá</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="p-3 sm:p-4">
        <ul className="sidebar-menu">
          <li className="mb-1 sm:mb-2">
            {user && (
              <Link
                to={`/my-account/profile/${user.user_id}`}
                className="flex items-center gap-2 p-2 rounded-md text-gray-700 hover:bg-gray-50 transition text-sm sm:text-base"
              >
                <FaRegUser className="text-lg flex-shrink-0" />
                <span className="truncate">Thông tin cá nhân</span>
              </Link>
            )}
          </li>
          <li className="mb-1 sm:mb-2">
            <Link
              to="/my-account/orders"
              className="flex items-center gap-2 p-2 rounded-md text-gray-700 hover:bg-gray-50 transition text-sm sm:text-base"
            >
              <MdOutlineShoppingCart className="text-lg flex-shrink-0" />
              <span className="truncate">Đơn hàng của tôi</span>
            </Link>
          </li>
          <li className="mb-1 sm:mb-2">
            <Link
              to="/my-account/addresses"
              className="flex items-center gap-2 p-2 rounded-md text-gray-700 hover:bg-gray-50 transition text-sm sm:text-base"
            >
              <IoLocationOutline className="text-lg flex-shrink-0" />
              <span className="truncate">Địa chỉ</span>
            </Link>
          </li>
          <li className="mb-1 sm:mb-2">
            <Link
              to="/my-account/wishlist"
              className="flex items-center gap-2 p-2 rounded-md text-gray-700 hover:bg-gray-50 transition text-sm sm:text-base"
            >
              <CiHeart className="text-lg flex-shrink-0" />
              <span className="truncate">Sản phẩm yêu thích</span>
            </Link>
          </li>
          <li className="mt-4 sm:mt-6 border-t pt-3 sm:pt-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 p-2 rounded-md text-red-500 hover:bg-red-50 transition w-full text-sm sm:text-base"
            >
              <MdOutlineLogout className="text-lg flex-shrink-0" />
              <span className="truncate">Đăng xuất</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AccountSidebar;
