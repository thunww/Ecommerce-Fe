import React from "react";
import { FaSearch } from "react-icons/fa";

const ProductFilters = ({ filters, onFilterChange, onReset }) => {
  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };

  const handleCategoryChange = (e) => {
    onFilterChange({ category: e.target.value });
  };

  const handleTypeChange = (e) => {
    onFilterChange({ productType: e.target.value });
  };

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Search input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search Products"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={filters.search}
            onChange={handleSearchChange}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 text-sm">
            Search Product Name, Parent SKU, SKU, Item ID
          </div>
        </div>

        {/* Category dropdown */}
        <div className="relative">
          <div className="flex items-center">
            <label className="block text-sm font-medium text-gray-700 mr-2">
              Product Category
            </label>
            <input
              type="text"
              placeholder="search by category"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={filters.category}
              onChange={handleCategoryChange}
            />
          </div>
        </div>

        {/* Product Type dropdown */}
        <div className="relative">
          <div className="flex items-center">
            <label className="block text-sm font-medium text-gray-700 mr-2">
              Product Type
            </label>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={filters.productType}
              onChange={handleTypeChange}
            >
              <option value="">Select</option>
              <option value="physical">Physical</option>
              <option value="digital">Digital</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          className="px-4 py-2 bg-white border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50"
          onClick={() => onFilterChange(filters)}
        >
          Apply
        </button>
        <button
          className="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-200"
          onClick={onReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ProductFilters; 