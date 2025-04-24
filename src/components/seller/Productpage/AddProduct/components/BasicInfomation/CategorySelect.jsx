import React from "react";

const CategorySelect = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <span className="text-red-500 mr-1">*</span>
        <label className="text-sm font-medium">Category</label>
      </div>

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Please set category"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          readOnly
        />
        <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CategorySelect;