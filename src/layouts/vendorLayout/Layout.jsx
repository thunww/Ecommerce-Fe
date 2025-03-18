import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import RightSidebar from "./RightSidebar";

const VendorLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar bên trái */}
      <div className="w-64 pt-16 ">
        <Sidebar />
      </div>

      {/* Nội dung chính */}
      <div className="flex flex-col flex-1 overflow-y-auto scrollbar-hide pt-16 pr-16">
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Sidebar bên phải */}
      <div className="w-16 pt-16">
        <RightSidebar />
      </div>
    </div>
  );
};

export default VendorLayout;
