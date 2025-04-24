import React from "react";

const ProductDescription = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <span className="text-red-500 mr-1">*</span>
        <label className="text-sm font-medium">Product Description</label>
      </div>

      <div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 h-32 resize-none"
          maxLength={3000}
          placeholder="Describe your product's features and specifications"
        />
        <div className="text-right text-sm text-gray-500 mt-1">
          {value.length}/3000
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;