import React from "react";

const EmptyState = () => {
  return (
    <div className="py-16 flex flex-col items-center justify-center border-b border-x rounded-b-lg bg-white">
      <div className="w-20 h-20 mb-4 text-gray-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <p className="text-gray-500 mb-2">Empty</p>
      <p className="text-gray-400 text-sm">Try again later</p>
    </div>
  );
};

export default EmptyState;
