import React, { Component } from 'react';
import OrderRow from './OrderRow';

class OrderTableBody extends Component {
  render() {
    const { orders } = this.props;
    
    return (
      <div className="border-b border-x rounded-b-lg">
        {orders.map((order) => (
          <OrderRow key={order.id} order={order} />
        ))}
      </div>
    );
  }
}

export default OrderTableBody;