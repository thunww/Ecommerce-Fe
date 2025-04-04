import React from "react";

const ProductTabs = ({ activeTab, onTabChange }) => {
  const tabs = ["Basic information", "Sales information", "Shipping", "Others"];

  return (
    <div className="flex">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-6 py-4 text-sm font-medium relative
            ${
              activeTab === tab
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-500 hover:text-gray-700"
            }
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default ProductTabs;
