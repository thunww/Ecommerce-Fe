import { useState } from "react";
import { Outlet } from "react-router-dom"; // Dùng Outlet để hiển thị route con
import Header from "../components/admin/AdminHeader";
import Sidebar from "../components/admin/Sidebar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar không nằm trong flex để tránh đẩy content */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <Header onMenuClick={toggleSidebar} />
        <main className="p-2 overflow-auto h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
