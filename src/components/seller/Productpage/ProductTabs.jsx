import React from "react";

const ProductTabs = ({ activeTab, onTabChange, counts = {} }) => {
  const tabs = [
    { id: "all", label: "All", count: counts.all || 0 },
    { id: "live", label: "Live", count: counts.live || 0 },
    { id: "violation", label: "Violation", count: counts.violation || 0 },
    { id: "review", label: "Under Shopee Review", count: counts.review || 0 },
    { id: "unpublished", label: "Unpublished", count: counts.unpublished || 0 }
  ];

  return (
    <div className="border-b border-gray-200">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-5 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === tab.id
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductTabs; 