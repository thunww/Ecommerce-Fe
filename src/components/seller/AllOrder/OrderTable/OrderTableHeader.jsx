import React from "react";

const OrderTableHeader = ({
  onSelectAll,
  allSelected,
  hasSelectedItems,
  onProcessOrders,
}) => {
  return (
    <div className="mb-4">
      {/* Bulk Actions Bar - Only visible when items are selected */}
      {hasSelectedItems && (
        <div className="bg-blue-50 p-3 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Selected items</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              title="Process selected orders"
              onClick={onProcessOrders}
            >
              Process Orders
            </button>
            <div className="relative">
              <button className="p-1 rounded hover:bg-blue-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Header */}
      <div className="grid grid-cols-6 py-4 px-4 bg-gray-50 text-sm font-medium text-gray-500 rounded-t-lg border-t border-x">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="mr-2 h-4 w-4"
            onChange={onSelectAll}
            checked={allSelected}
          />
          <span>Product</span>
        </div>
        <div>Total Quantity & Revenue</div>
        <div>Status</div>
        <div>Color</div>
        <div>Price</div>
        <div className="text-center">Actions</div>
      </div>
    </div>
  );
};

export default OrderTableHeader;
