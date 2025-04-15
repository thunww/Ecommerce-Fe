import React from "react";
import { useSearchParams } from "react-router-dom";

const MainTabs = ({ onStatusChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "all";

  // Ánh xạ từ ID tab sang giá trị trạng thái đơn hàng
  const tabToStatusMap = {
    all: "all",
    "pending-confirmation": "pending",
    "waiting-for-pickup": "processing",
    "in-transit": "shipped",
    delivered: "delivered",
    "returns-refunds-cancellations": "cancelled",
  };

  const tabs = [
    { id: "all", label: "All" },
    { id: "pending-confirmation", label: "Pending Confirmation" },
    { id: "waiting-for-pickup", label: "Waiting for Pickup" },
    { id: "in-transit", label: "In Transit" },
    { id: "delivered", label: "Delivered" },
    {
      id: "returns-refunds-cancellations",
      label: "Returns/Refunds/Cancellations",
    },
  ];

  const handleTabClick = (tabId) => {
    // Cập nhật URL param
    setSearchParams({ tab: tabId });

    // Cập nhật trạng thái lọc cho component cha
    if (onStatusChange) {
      onStatusChange(tabToStatusMap[tabId]);
    }
  };

  return (
    <div className="border-b border-gray-200 mb-4 overflow-x-auto">
      <div className="flex min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === tab.id
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            }`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainTabs;
