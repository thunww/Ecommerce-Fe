import React, { useEffect, useState } from "react";
import Table from "../../components/common/Table"; // Import table
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Giả lập API gọi danh sách users
  useEffect(() => {
    setTimeout(() => {
      setUsers([
        { id: 1, name: "Nguyễn Văn A", email: "a@gmail.com", role: "Admin" },
        { id: 2, name: "Trần Thị B", email: "b@gmail.com", role: "User" },
        { id: 3, name: "Phạm Văn C", email: "c@gmail.com", role: "User" },
        { id: 4, name: "Lê Thị D", email: "d@gmail.com", role: "Editor" },
        { id: 5, name: "Hoàng Văn E", email: "e@gmail.com", role: "User" },
        { id: 6, name: "Đỗ Thị F", email: "f@gmail.com", role: "User" },
        { id: 7, name: "Bùi Văn G", email: "g@gmail.com", role: "Admin" },
        { id: 8, name: "Trịnh Thị H", email: "h@gmail.com", role: "User" },
        { id: 9, name: "Lâm Văn I", email: "i@gmail.com", role: "Editor" },
        { id: 10, name: "Hồ Thị J", email: "j@gmail.com", role: "User" },
        { id: 11, name: "Vũ Văn K", email: "k@gmail.com", role: "User" },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  // Thêm user
  const handleAddUser = () => {
    const newUser = {
      id: users.length + 1,
      name: `User ${users.length + 1}`,
      email: `user${users.length + 1}@gmail.com`,
      role: "User",
    };
    setUsers([...users, newUser]);
  };

  // Sửa user
  const handleEditUser = (id) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, name: user.name + " (Edited)" } : user
      )
    );
  };

  // Xóa user
  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  // Lọc user theo search
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
  );

  // Cấu hình cột bảng
  const columns = [
    { header: "ID", field: "id" },
    { header: "Name", field: "name" },
    { header: "Email", field: "email" },
    { header: "Role", field: "role" },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-full mx-auto bg-white shadow-lg rounded-lg p-8">
        {/* Tiêu đề + Nút thêm */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Users Management</h2>
          <button
            onClick={handleAddUser}
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 transition"
          >
            <FaPlus className="mr-2" /> Add User
          </button>
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
          <Table
            columns={columns}
            data={filteredUsers}
            onUpdate={handleEditUser}
            onDelete={handleDeleteUser}
            pageSize={10}
          />
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
