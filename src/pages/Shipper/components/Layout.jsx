import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import SideBar from "./Header/SideBar";

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Xử lý tự động đóng Sidebar khi màn hình nhỏ hơn 768px
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex h-screen bg-gray-100">
           
            {/* Main Content */}
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ${
                    isSidebarOpen ? "ml-64" : "ml-0"
                }`}
            >
                {/* Header */}
                <Header onMenuClick={toggleSidebar} />

                {/* Content */}
                <main className="p-6 overflow-auto h-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
