import React from "react";

const Header = () => {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <button className="p-2 bg-gray-200 rounded-full">🔔</button>
        <button className="p-2 bg-gray-200 rounded-full">👤</button>
      </div>
    </header>
  );
};

export default Header;
