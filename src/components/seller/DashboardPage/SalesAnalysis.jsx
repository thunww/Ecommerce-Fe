import React, { Component } from "react";

class SalesAnalytics extends Component {
  render() {
    return (
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-bold text-lg">Sales Analytics</h2>
        <div className="grid grid-cols-5 text-center">
          <div>
            <p className="text-xl font-bold">₫0</p>
            <p>Revenue</p>
          </div>
          <div>
            <p className="text-xl font-bold">0</p>
            <p>Visits</p>
          </div>
          <div>
            <p className="text-xl font-bold">0</p>
            <p>Views</p>
          </div>
          <div>
            <p className="text-xl font-bold">0</p>
            <p>Orders</p>
          </div>
          <div>
            <p className="text-xl font-bold">0.00%</p>
            <p>Conversion Rate</p>
          </div>
        </div>
      </div>
    );
  }
}

export default SalesAnalytics;
