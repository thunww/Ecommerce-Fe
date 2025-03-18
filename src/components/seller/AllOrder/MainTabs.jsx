import React from "react";
import { useSearchParams } from "react-router-dom";

const MainTabs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "waiting-for-pickup";

  const tabs = [
    { id: "all", label: "All" },
    { id: "pending-confirmation", label: "Pending Confirmation" },
    { id: "waiting-for-pickup", label: "Waiting for Pickup" },
    { id: "in-transit", label: "In Transit" },
    { id: "delivered", label: "Delivered" },
    { id: "returns-refunds-cancellations", label: "Returns / Refunds / Cancellations" },
  ];

  return (
    <div className="border-b border-gray-200">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab.id ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-700"
            }`}
            onClick={() => setSearchParams({ tab: tab.id })}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainTabs;
