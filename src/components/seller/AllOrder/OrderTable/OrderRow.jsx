import React, { Component } from 'react';

class OrderRow extends Component {
  render() {
    const { order } = this.props;
    
    return (
      <div className="grid grid-cols-6 py-4 px-4 text-sm border-t first:border-t-0">
        <div className="flex items-center">
          {/* Product Information */}
          <div className="w-12 h-12 bg-gray-100 rounded mr-2"></div>
          <div>
            <div className="font-medium">{order.productName}</div>
            <div className="text-gray-500">Code: {order.orderCode}</div>
          </div>
        </div>
        <div className="flex items-center font-medium">{order.total}</div>
        <div className="flex items-center">
          <span className={`px-2 py-1 rounded-full text-xs ${
            order.status === 'Waiting for pickup' ? 'bg-blue-100 text-blue-600' : 
            order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 
            'bg-gray-100 text-gray-600'
          }`}>
            {order.status}
          </span>
        </div>
        <div className="flex items-center">{order.point}</div>
        <div className="flex items-center">{order.shippingUnit}</div>
        <div className="flex items-center space-x-2">
          <button className="px-2 py-1 text-xs bg-blue-500 text-white rounded">Details</button>
          <button className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">Cancel</button>
        </div>
      </div>
    );
  }
}

export default OrderRow;
