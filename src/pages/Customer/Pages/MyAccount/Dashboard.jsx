import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { fetchUserById } from "../../../../redux/adminSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = useSelector((state) => state.auth.user?.user_id);
  const user = useSelector((state) => state.admin.selectedUser);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
    }
  }, [dispatch, userId]);

  return (
    <div className="dashboard">
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
      <div className="welcome mb-8">
        <p className="text-lg">
          Xin chào,{" "}
          <span className="font-semibold">
            {user
              ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
              : "Người dùng"}
          </span>
          !
        </p>
        <p className="mt-2 text-gray-600">
          Từ dashboard của tài khoản, bạn có thể xem các đơn hàng gần đây, quản
          lý địa chỉ giao hàng và cập nhật thông tin cá nhân.
        </p>
      </div>

      <div className="account-summary">
        <h3 className="text-xl font-semibold mb-4">Tổng quan tài khoản</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Thông tin cá nhân */}
          <div className="account-box border p-4 rounded-md">
            <h4 className="font-semibold mb-2">Thông tin cá nhân</h4>
            <p className="text-gray-600 mb-1">
              {user
                ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
                : "Chưa cập nhật"}
            </p>
            <p className="text-gray-600">{user?.email || "Chưa cập nhật"}</p>
            <button
              className="mt-3 text-blue-600 hover:text-blue-800"
              onClick={() => navigate("/profile")} // Điều hướng đến trang chỉnh sửa
            >
              Chỉnh sửa
            </button>
          </div>

          {/* Đơn hàng gần đây */}
          <div className="account-box border p-4 rounded-md">
            <h4 className="font-semibold mb-2">Đơn hàng gần đây</h4>
            <p className="text-gray-600 mb-1">Bạn chưa có đơn hàng nào.</p>
            <button
              className="mt-3 text-blue-600 hover:text-blue-800"
              onClick={() => navigate("/orders")} // Điều hướng đến trang đơn hàng
            >
              Xem tất cả đơn hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
