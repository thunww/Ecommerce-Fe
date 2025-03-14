import React, { Component } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";

class SalesPerformance extends Component {
  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 text-gray-700">
            <div className="flex justify-between">
              <span>Products Locked:</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between">
              <span>Conversion Rate:</span>
              <span className="font-semibold">0.00%</span>
            </div>
            <div className="text-blue-500 cursor-pointer hover:underline">
              View Details
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default SalesPerformance;
