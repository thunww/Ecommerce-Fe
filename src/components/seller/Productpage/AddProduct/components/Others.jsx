import React, { useState } from "react";

const Others = ({ hasCategory }) => {
  const [preOrder, setPreOrder] = useState("No");
  const [condition, setCondition] = useState("New");
  const [parentSKU, setParentSKU] = useState("");

  return (
    <div>
      <div className="space-y-8">
        <h2 className="text-lg font-medium">Others</h2>

        {!hasCategory ? (
          <div className="text-center py-8 text-gray-500">
            Available only after you select a product category
          </div>
        ) : (
          <div className="space-y-8">
            {/* Pre-Order */}
            <div className="grid grid-cols-[180px,1fr] gap-2">
              <div className="flex items-start">
                <span className="text-sm">Pre-Order</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="preOrder"
                      value="No"
                      checked={preOrder === "No"}
                      onChange={(e) => setPreOrder(e.target.value)}
                      className="text-red-500 focus:ring-red-500"
                    />
                    <span className="text-sm">No</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="preOrder"
                      value="Yes"
                      checked={preOrder === "Yes"}
                      onChange={(e) => setPreOrder(e.target.value)}
                      className="text-red-500 focus:ring-red-500"
                    />
                    <span className="text-sm">Yes</span>
                  </label>
                </div>
                <div className="text-xs text-gray-500">
                  I will ship out within 2 business days. (excluding public holidays and courier service non-working days)
                </div>
              </div>
            </div>

            {/* Condition */}
            <div className="grid grid-cols-[180px,1fr] gap-2">
              <div className="flex items-start">
                <span className="text-sm">Condition</span>
              </div>
              <div>
                <div className="relative w-[200px]">
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm appearance-none bg-white pr-8"
                  >
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Parent SKU */}
            <div className="grid grid-cols-[180px,1fr] gap-2">
              <div className="flex items-start">
                <span className="text-sm">Parent SKU</span>
              </div>
              <div>
                <input
                  type="text"
                  value={parentSKU}
                  onChange={(e) => setParentSKU(e.target.value)}
                  className="w-[200px] px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Others;