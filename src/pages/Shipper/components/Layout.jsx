import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import SideBar from "./Header/SideBar";

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content */}
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ${
                    isSidebarOpen ? "ml-64" : "ml-20"
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
