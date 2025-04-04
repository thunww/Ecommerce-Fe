import React from "react";

const ProductNameInput = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <span className="text-red-500 mr-1">*</span>
        <label className="text-sm font-medium">Product Name</label>
      </div>

      <div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Brand Name + Product Type + Key Features (Materials, Colors, Size, Model)"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          maxLength={120}
        />
        <div className="text-right text-sm text-gray-500 mt-1">
          {value.length}/120
        </div>
      </div>
    </div>
  );
};

export default ProductNameInput;