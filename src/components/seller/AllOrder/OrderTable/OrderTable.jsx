import React, { Component } from 'react';
import OrderTableHeader from './OrderTableHeader';
import OrderTableBody from './OrderTableBody';
import EmptyState from './EmptyState';

class OrderTable extends Component {
  render() {
    const { orders } = this.props;
    
    return (
      <div className="mt-4">
        <OrderTableHeader />
        {orders && orders.length > 0 ? (
          <OrderTableBody orders={orders} />
        ) : (
          <EmptyState />
        )}
      </div>
    );
  }
}

export default OrderTable;