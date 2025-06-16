import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import RightSidebar from "./RightSidebar";
import { useState } from "react";
import { useSelector } from "react-redux";

const VendorLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  // Kiểm tra user, nếu không có thì chuyển hướng về trang login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar bên trái */}
      <div className="w-64 pt-16">
        <Sidebar />
      </div>

      {/* Nội dung chính */}
      <div
        className={`flex flex-col flex-1 overflow-y-auto scrollbar-hide pt-16 transition-all duration-300 ${
          isSidebarOpen ? "pr-96" : "pr-16"
        }`}
      >
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* RightSidebar */}
      <RightSidebar setIsSidebarOpen={setIsSidebarOpen} />
    </div>
  );
};

export default VendorLayout;
