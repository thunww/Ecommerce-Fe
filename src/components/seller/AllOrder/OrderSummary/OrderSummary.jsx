import React, { Component } from "react";
import OrderCount from "./OrderCount";

class OrderSummary extends Component {
  render() {
    const { orderCount } = this.props;

    return (
      <div className="mt-6 flex justify-between items-center">
        <OrderCount count={orderCount} />
      </div>
    );
  }
}

export default OrderSummary;
