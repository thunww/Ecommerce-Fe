import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  banUser,
  updateUserStatus,
  unbanUser,
  assignRoleToUser,
} from "../../redux/adminSlice";
import Table from "../../components/common/Table";
import {
  FaSearch,
  FaUserSlash,
  FaUserCheck,
  FaEye,
  FaUsers,
  FaCheckCircle,
  FaUserClock,
} from "react-icons/fa";
import { Unlock } from "lucide-react";

import Swal from "sweetalert2";

import { useNavigate } from "react-router-dom";

const ManageUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users = [], loading } = useSelector((state) => state.admin);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Filter users based on search
  const filteredUsers =
    users?.filter((user) => {
      const searchTerm = search.toLowerCase();
      return (
        user.username?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm) ||
        user.user_id?.toString().includes(searchTerm) // ✅ Thêm tìm theo user_id
      );
    }) ?? [];

  const handleBan = (user_id) => {
    Swal.fire({
      title: "Confirm Action",
      text: "Are you sure you want to ban this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, ban the user!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await dispatch(banUser(user_id));

        if (banUser.fulfilled.match(response)) {
          Swal.fire({
            title: "Success!",
            text: "The user has been banned from the system.",
            icon: "success",
            confirmButtonColor: "#3085d6",
          });
          dispatch(updateUserStatus({ userId: user_id, status: "banned" }));
        } else {
          Swal.fire({
            title: "Error!",
            text: response.payload || "Failed to ban the user.",
            icon: "error",
            confirmButtonColor: "#d33",
          });
        }
      }
    });
  };

  const handleUnban = (user_id) => {
    Swal.fire({
      title: "Unban User",
      text: "Are you sure you want to unban this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, unban the user!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await dispatch(unbanUser(user_id));

        if (unbanUser.fulfilled.match(response)) {
          Swal.fire({
            title: "Success!",
            text: "The user has been unbanned successfully.",
            icon: "success",
            confirmButtonColor: "#3085d6",
          });
          dispatch(updateUserStatus({ userId: user_id, status: "active" }));
        } else {
          Swal.fire({
            title: "Error!",
            text: response.payload || "Failed to unban the user.",
            icon: "error",
            confirmButtonColor: "#d33",
          });
        }
      }
    });
  };

  // Hàm xem thông tin người dùng
  const handleView = (user_id) => {
    navigate(`/admin/view-user/${user_id}`);
  };

  const handleGrantPermission = (user_id) => {
    Swal.fire({
      title: "User permissions",
      html: `
        <div class="mb-3">
          <p class="text-gray-700 mb-2">Select the permissions you want to grant to the user:</p>
          <div class="flex flex-col gap-2">
            <label class="inline-flex items-center">
              <input type="radio" name="role" value="customer" class="form-radio h-5 w-5 text-blue-600" checked>
              <span class="ml-2 text-gray-700">Customer</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" name="role" value="admin" class="form-radio h-5 w-5 text-green-600">
              <span class="ml-2 text-gray-700">Admin</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" name="role" value="vendor" class="form-radio h-5 w-5 text-purple-600">
              <span class="ml-2 text-gray-700">Vendor</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" name="role" value="shipper" class="form-radio h-5 w-5 text-orange-600">
              <span class="ml-2 text-gray-700">Shipper</span>
            </label>
          </div>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm permission",
      cancelButtonText: "Cancel",
      background: "#fff",
      borderRadius: "10px",
      focusConfirm: false,
      preConfirm: () => {
        const selectedRole = document.querySelector(
          'input[name="role"]:checked'
        ).value;
        return { role: selectedRole };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const roleMapping = {
          admin: 1,
          customer: 2,
          shipper: 3,
          vendor: 4,
        };
        const selectedRole = result.value.role;
        const roleId = roleMapping[selectedRole];
        // Gọi API Redux để gán role
        dispatch(assignRoleToUser({ userId: user_id, roleId: roleId }))
          .unwrap()
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Authorization successful!",
              text: `User has been granted permission ${selectedRole.toUpperCase()}.`,
              confirmButtonColor: "#3085d6",
              timer: 2000,
              timerProgressBar: true,
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Failed!",
              text: error || "Failed to grant user permission.",
              confirmButtonColor: "#d33",
            });
          });
      }
    });
  };
  // Table columns configuration
  const columns = [
    { header: "ID", field: "user_id" },
    {
      header: "Avatar",
      field: "profile_picture",
      render: (profile_picture) => (
        <div className="flex justify-center">
          <img
            src={
              profile_picture ||
              "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"
            }
            alt="Avatar"
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-md"
          />
        </div>
      ),
    },
    { header: "User name", field: "username" },
    { header: "Email", field: "email" },
    {
      header: "Role",
      field: "roles",
      render: (roles) => (
        <div className="flex gap-1 flex-wrap">
          {roles.map((role, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
            >
              {role}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: "Status",
      field: "status",
      render: (status) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            status === "active"
              ? "bg-green-100 text-green-800"
              : status === "in_active"
              ? "bg-gray-100 text-gray-800"
              : status === "banned"
              ? "bg-red-300 text-red-500"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      header: "Verify",
      field: "is_verified",
      render: (is_verified) =>
        is_verified ? (
          <div className="flex items-center justify-center">
            <span className="flex items-center bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
              <FaUserCheck className="mr-1" />
              Verified
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <span className="flex items-center bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full">
              <FaUserSlash className="mr-1" />
              Not Verified
            </span>
          </div>
        ),
    },

    {
      header: "Actions",
      field: "actions",
      render: (_, user) => {
        return (
          <div className="flex items-center justify-center space-x-2">
            {/* Xem thông tin user */}
            <button
              onClick={() => navigate(`/admin/view-user/${user?.user_id}`)}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow-md transition duration-200 hover:scale-105"
              title="View User"
            >
              <FaEye />
            </button>

            {/* Cấp quyền user */}
            <button
              onClick={() => handleGrantPermission(user?.user_id)}
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg shadow-md transition duration-200 hover:scale-105"
              title="Grant Permission"
            >
              <FaUserCheck />
            </button>

            {/* Cấm user */}
            {user?.status === "banned" ? (
              <button
                onClick={() => handleUnban(user?.user_id)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg shadow-md transition duration-200 hover:scale-105"
                title="Unban User"
              >
                <FaCheckCircle />
              </button>
            ) : (
              <button
                onClick={() => handleBan(user?.user_id)}
                className="bg-red-500 hover:bg-yellow-600 text-white p-2 rounded-lg shadow-md transition duration-200 hover:scale-105"
                title="Ban User"
              >
                <FaUserSlash />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-full mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
          <h2 className="text-2xl font-bold text-white">Users Management</h2>
          <p className="text-blue-100 mt-1">
            Manage all system users from this dashboard
          </p>
        </div>

        <div className="p-6">
          {/* Search bar */}
          <div className="flex items-center bg-gray-100 p-4 rounded-xl mb-6 shadow-sm border border-gray-200">
            <FaSearch className="text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-800 font-medium"
            />
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-100">
              <div className="flex items-center mb-2">
                <FaUsers className="text-blue-500 text-xl mr-2" />
                <p className="text-blue-500 font-medium">Total Users</p>
              </div>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-100">
              <div className="flex items-center mb-2">
                <FaUserCheck className="text-green-500 text-xl mr-2" />
                <p className="text-green-500 font-medium">Verified Users</p>
              </div>
              <p className="text-2xl font-bold">
                {users.filter((user) => user.is_verified).length}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl shadow-sm border border-purple-100">
              <div className="flex items-center mb-2">
                <FaUserClock className="text-purple-500 text-xl mr-2" />
                <p className="text-purple-500 font-medium">Active Users</p>
              </div>
              <p className="text-2xl font-bold">
                {users.filter((user) => user.status === "active").length}
              </p>
            </div>
          </div>
          {/* Users Table */}
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
              <Table columns={columns} data={filteredUsers} pageSize={10} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
