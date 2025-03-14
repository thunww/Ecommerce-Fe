import React, { Component } from 'react';
import OrderCount from './OrderCount';
import SortOptions from './SortOptions';
import BatchActionButton from './BatchActionButton';

class OrderSummary extends Component {
  render() {
    const { orderCount, sortOption, onSortChange, onBatchShipping } = this.props;

    return (
      <div className="mt-6 flex justify-between items-center">
        <OrderCount count={orderCount} />
        <div className="flex items-center">
          <SortOptions value={sortOption} onChange={onSortChange} />
          <BatchActionButton onClick={onBatchShipping} />
        </div>
      </div>
    );
  }
}

export default OrderSummary;