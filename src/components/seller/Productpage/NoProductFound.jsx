import React from "react";

const NoProductFound = () => {
  return (
    <div className="py-10 flex flex-col items-center justify-center">
      <div className="w-24 h-24 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#ccc" strokeWidth="1">
          <rect x="10" y="10" width="44" height="44" rx="2" strokeLinejoin="round" />
          <line x1="32" y1="20" x2="32" y2="44" />
          <line x1="20" y1="32" x2="44" y2="32" />
        </svg>
      </div>
      <h3 className="text-gray-400 text-lg font-medium mb-1">No Product Found</h3>
    </div>
  );
};

export default NoProductFound; 