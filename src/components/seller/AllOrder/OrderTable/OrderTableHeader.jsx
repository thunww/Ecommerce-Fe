import React, { Component } from 'react';

class OrderTableHeader extends Component {
  render() {
    return (
      <div className="border rounded-t-lg bg-gray-50">
        <div className="grid grid-cols-6 py-3 px-4 text-sm font-medium text-gray-700">
          <div>Product</div>
          <div>Total</div>
          <div>Status</div>
          <div className="flex items-center">
            Reverse Points
            <span className="ml-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <div>Shipping Unit</div>
          <div>Actions</div>
        </div>
      </div>
    );
  }
}

export default OrderTableHeader;
