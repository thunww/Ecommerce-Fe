import React, { Component } from "react";

class HeaderActions extends Component {
  render() {
    return (
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-800">All</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded text-gray-700">
            Export
          </button>
          <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded text-orange-500">
            Export Report History
          </button>
        </div>
      </div>
    );
  }
}

export default HeaderActions;
