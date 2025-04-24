import React, { Component } from 'react';

class OrderCount extends Component {
  render() {
    const { count } = this.props;
    return (
      <div className="text-sm font-medium">{count} Package</div>
    );
  }
}

export default OrderCount;