import React from "react";

const SupportPanel = ({ onClose }) => {
  return (
    <div className="fixed top-16 right-16 w-80 h-screen bg-white shadow-lg border-l p-4">
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-lg font-semibold">Chat with Shopee</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-black">
          ✖
        </button>
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-orange-500 font-semibold">
          I am Sophie, your AI Assistant
        </p>
        <div className="space-y-2">
          <button className="w-full p-2 bg-gray-100 rounded">
            📦 Shipping
          </button>
          <button className="w-full p-2 bg-gray-100 rounded">
            📈 Marketing
          </button>
          <button className="w-full p-2 bg-gray-100 rounded">💰 Payment</button>
        </div>
      </div>
    </div>
  );
};

export default SupportPanel;
