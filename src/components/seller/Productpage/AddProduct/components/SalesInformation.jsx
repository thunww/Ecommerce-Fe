import React, { useState } from "react";

const SalesInformation = ({ hasCategory, productData, onInputChange }) => {
  const [variations, setVariations] = useState([]);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [selectedSizeChart, setSelectedSizeChart] = useState("template");

  return (
    <div>
      <div className="space-y-8">
        <h2 className="text-lg font-medium">Sales Information</h2>

        {!hasCategory ? (
          <div className="text-center py-8 text-gray-500">
            Available only after you select a product category
          </div>
        ) : (
          <div className="space-y-8">
            {/* Variations */}
            <div className="grid grid-cols-[180px,1fr] gap-2">
              <div className="flex items-start">
                <span className="text-red-500 mr-0.5">*</span>
                <span className="text-sm">Variations</span>
              </div>
              <div>
                <button className="inline-flex items-center px-4 py-2 border border-dashed border-red-500 rounded hover:bg-red-50">
                  <span className="text-red-500 mr-1">+</span>
                  <span className="text-red-500">Enable Variations</span>
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="grid grid-cols-[180px,1fr] gap-2">
              <div className="flex items-start">
                <span className="text-red-500 mr-0.5">*</span>
                <span className="text-sm">Price</span>
              </div>
              <div className="relative w-[200px]">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  ₫
                </div>
                <input
                  type="text"
                  className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="Input"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Stock */}
            <div className="grid grid-cols-[180px,1fr] gap-2">
              <div className="flex items-start">
                <span className="text-red-500 mr-0.5">*</span>
                <span className="text-sm">Stock</span>
                <span className="ml-1 text-gray-400">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                </span>
              </div>
              <div>
                <input
                  type="text"
                  className="w-[200px] px-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
            </div>

            {/* Size Chart */}
            <div className="grid grid-cols-[180px,1fr] gap-2">
              <div className="flex items-start">
                <span className="text-sm">Size Chart</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="sizeChartType"
                      value="template"
                      checked={selectedSizeChart === "template"}
                      onChange={(e) => setSelectedSizeChart(e.target.value)}
                      className="text-red-500 focus:ring-red-500"
                    />
                    <span className="text-sm">Template</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="sizeChartType"
                      value="image"
                      checked={selectedSizeChart === "image"}
                      onChange={(e) => setSelectedSizeChart(e.target.value)}
                      className="text-red-500 focus:ring-red-500"
                    />
                    <span className="text-sm">Image</span>
                  </label>
                </div>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-400 appearance-none pr-10"
                    value=""
                  >
                    <option value="">
                      Use the size chart, will increase the search exposure of
                      your product
                    </option>
                  </select>
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50">
                    Add New Size Chart
                  </button>
                </div>
              </div>
            </div>

            {/* Wholesale */}
            <div className="grid grid-cols-[180px,1fr] gap-2">
              <div className="flex items-start">
                <span className="text-sm">Wholesale</span>
              </div>
              <div className="space-y-2">
                <button className="inline-flex items-center px-4 py-2 border border-dashed border-gray-300 rounded hover:bg-gray-50">
                  <span className="text-red-500 mr-1">+</span>
                  <span className="text-red-500">Add Price Tier</span>
                </button>
                <div className="text-xs text-gray-400">
                  Wholesale will be hidden when product is under Add-on Deal &
                  Bundle Deal.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesInformation;
