// src/components/seller/Productpage/AddProduct/components/FillingSuggestion.jsx
import React from "react";

const FillingSuggestion = () => {
  const suggestions = [
    { text: "Add at least 3 images", completed: false },
    { text: "Add video", completed: false },
    { text: "Add characters for name to 25~100", completed: false },
    { text: "Add at least 100 characters or 1 image for description", completed: false },
    { text: "Add brand info", completed: false },
  ];

  return (
    <div className="rounded-lg overflow-hidden">
      {/* Header - thêm border màu xanh ở trên */}
      <div className="bg-blue-50 p-4 border-t-4 border-blue-500">
        <h2 className="text-[16px] font-normal text-gray-700">Filling Suggestion</h2>
      </div>

      {/* Content - thêm shadow và điều chỉnh padding */}
      <div className="bg-white py-5 px-6 shadow-sm">
        <ul className="space-y-5">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-center">
              {/* Điều chỉnh kích thước và style của circle */}
              <div className="w-[18px] h-[18px] rounded-full border border-gray-300 mr-3 flex-shrink-0">
                {suggestion.completed && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 m-auto" />
                )}
              </div>
              {/* Điều chỉnh font size và màu text */}
              <span className="text-[14px] text-gray-600 leading-tight">
                {suggestion.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FillingSuggestion;