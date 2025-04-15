import React, { Component } from "react";
import OrderRow from "./OrderRow";

class OrderTableBody extends Component {
  render() {
    const { orders, selectedOrders, onSelectOrder, onOrderAction } = this.props;

    console.log(
      "Orders in OrderTableBody:",
      orders.map((order) => ({
        id: order.id,
        product_id: order.product_id,
        status: order.latest_order_status,
      }))
    );

    return (
      <div className="border-b rounded-b-lg">
        {orders.map((order) => {
          // Ensure each order has a consistent identifier
          const orderId = order.id || order.product_id || order.variant_id;
          const isSelected = selectedOrders.includes(orderId);

          return (
            <OrderRow
              key={`order-${orderId}`}
              order={order}
              selected={isSelected}
              onSelect={onSelectOrder}
              onActionClick={onOrderAction}
            />
          );
        })}
      </div>
    );
  }
}

export default OrderTableBody;
