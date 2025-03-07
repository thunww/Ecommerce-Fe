import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  
    return (
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        {/* Main Content với Header dịch chuyển theo Sidebar */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-20"
          }`}
        >
          {/* Header (Chỉ có 1 nút menu) */}
          <Header onMenuClick={toggleSidebar} />
          
          {/* Content */}
          <main className="p-6 overflow-auto h-full">
            <Dashboard />
            {children}
          </main>
        </div>
      </div>
    );
  };
  
  export default AdminLayout;
  