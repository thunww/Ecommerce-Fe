import React, { Component } from "react";
import { Card } from "./Card"; // ✅ Dùng destructuring vì Card là export named

class Analytics extends Component {
  render() {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-3">Sales Analytics</h3>
        <div className="grid grid-cols-4 gap-4">
          <Card title="Views" value="0" />
          <Card title="Orders" value="0" />
          <Card title="Conversion Rate" value="0%" />
          <Card title="Revenue" value="$0.00" />
        </div>
      </div>
    );
  }
}

export default Analytics;
