import React from "react";

const ProductTabs = ({ activeTab, onTabChange, productCounts }) => {
  const tabs = [
    { id: "all", label: "All", count: productCounts.all },
    { id: "active", label: "Active", count: productCounts.active },
    { id: "inactive", label: "Inactive", count: productCounts.inactive },
    { id: "outOfStock", label: "Out of Stock", count: productCounts.outOfStock },
  ];

  return (
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? tab.id === "outOfStock"
                      ? "border-red-500 text-red-600"
                      : "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {tab.label}
              <span
                className={`
                ml-2 py-0.5 px-2 rounded-full text-xs
                ${
                  activeTab === tab.id
                    ? tab.id === "outOfStock"
                      ? "bg-red-100 text-red-600"
                      : "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }
              `}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default ProductTabs;