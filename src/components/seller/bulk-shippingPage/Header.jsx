import { useState } from "react";
import { Menu } from "lucide-react";

const Header = () => {
  const [activeTab, setActiveTab] = useState("Chờ giao hàng");

  return (
    <div className="p-4">
      {/* Tiêu đề */}
      <h1 className="text-xl font-semibold mb-2">Giao Hàng Loạt</h1>

      {/* Tabs */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab("Chờ giao hàng")}
            className={`relative font-medium ${
              activeTab === "Chờ giao hàng"
                ? "text-red-500"
                : "text-gray-600 hover:text-black"
            }`}
          >
            Chờ giao hàng
            {activeTab === "Chờ giao hàng" && (
              <div className="absolute left-0 bottom-[-4px] w-full h-[2px] bg-red-500"></div>
            )}
          </button>

          <button
            onClick={() => setActiveTab("Tạo phiếu")}
            className={`relative font-medium ${
              activeTab === "Tạo phiếu"
                ? "text-red-500"
                : "text-gray-600 hover:text-black"
            }`}
          >
            Tạo phiếu
            {activeTab === "Tạo phiếu" && (
              <div className="absolute left-0 bottom-[-4px] w-full h-[2px] bg-red-500"></div>
            )}
          </button>
        </div>

        {/* Nút "Chuẩn bị hàng" */}
        <button className="bg-white border px-4 py-1 text-sm rounded-md hover:bg-gray-100 flex items-center space-x-2">
          <span className="text-blue-600">Chuẩn bị hàng</span>
          <Menu size={18} />
        </button>
      </div>
    </div>
  );
};

export default Header;
