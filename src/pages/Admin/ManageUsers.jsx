import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, deleteUser } from "../../redux/adminSlice"; // Thêm deleteUser action
import Table from "../../components/common/Table";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ManageUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users = [], loading } = useSelector((state) => state.admin);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Lọc user theo search
  const filteredUsers =
    users?.filter(
      (user) =>
        user.first_name.toLowerCase().includes(search.toLowerCase()) ||
        user.last_name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

  // Hàm xử lý khi nhấn nút "Sửa"
  const handleEdit = (user_id) => {
    navigate(`/admin/edit-user/${user_id}`); // Điều hướng đến trang sửa người dùng
  };

  // Hàm xử lý khi nhấn nút "Xóa"
  const handleDelete = (user_id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      dispatch(deleteUser(user_id)); // Gọi action xóa người dùng
    }
  };

  // Cấu hình cột bảng
  const columns = [
    { header: "ID", field: "user_id" },
    {
      header: "Avatar",
      field: "profile_picture",
      render: (profile_picture) => (
        <img
          src={
            profile_picture ||
            "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"
          }
          alt="Avatar"
          className="w-10 h-10 rounded-full"
        />
      ),
    },
    { header: "Frist Name", field: "first_name" },
    { header: "Last Name", field: "last_name" },
    { header: "Email", field: "email" },
    { header: "Role", field: "roles", render: (roles) => roles.join(", ") },
    {
      header: "Verify",
      field: "is_verified",
      render: (is_verified) =>
        is_verified ? (
          <span className="text-green-600 font-semibold">Verified</span>
        ) : (
          <span className="text-red-600 font-semibold">Not Verified</span>
        ),
    },
    {
      header: "Actions",
      field: "actions",
      render: (users) => (
        <div className="flex space-x-2">
          {/* Nút Sửa */}
          <button
            onClick={() => handleEdit(users.user_id)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center"
          >
            <FaEdit className="mr-1" /> Edit
          </button>

          {/* Nút Xóa */}
          <button
            onClick={() => handleDelete(users.user_id)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center"
          >
            <FaTrash className="mr-1" /> Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-full mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Users Management</h2>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="flex items-center bg-gray-200 p-3 rounded-lg mb-6 shadow-sm">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-800"
          />
        </div>

        {/* Bảng Users */}
        {loading ? (
          <p className="text-center text-gray-500">Loading users...</p>
        ) : (
          <Table columns={columns} data={filteredUsers} pageSize={10} />
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
