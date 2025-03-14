import React, { Component } from "react";
import {Card} from "./Card";

class SellerPerformance extends Component {
  render() {
    return (
      <Card>
        <div className="border-b pb-2 mb-2 font-bold text-lg">Seller Efficiency</div>
        <div className="p-2 space-y-2 text-gray-700">
          <div className="flex justify-between">
            <span>Rank:</span>
            <span className="font-semibold text-green-600">Excellent</span>
          </div>
          <div className="flex justify-between">
            <span>Average rating:</span>
            <span className="font-semibold">4.9/5</span>
          </div>
          <div className="flex justify-between">
            <span>Response rating:</span>
            <span className="font-semibold">98%</span>
          </div>
        </div>
      </Card>
    );
  }
}

export default SellerPerformance;
