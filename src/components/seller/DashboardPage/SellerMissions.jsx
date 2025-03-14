import React, { Component } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";

class SellerTasks extends Component {
  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Seller Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-2 bg-green-100 text-green-700 rounded-md mb-2">
            ✅ You have completed 1 task! <span className="text-blue-500 cursor-pointer hover:underline">View Rewards</span>
          </div>
          {[
            "Complete the Beginner Course",
            "Finish the Shopee Selling Course",
            "Successfully Deliver an Order",
          ].map((task, index) => (
            <div key={index} className="border p-2 rounded-md mb-2 flex justify-between items-center">
              <span>{task}</span>
              <button className="bg-red-500 text-white px-3 py-1 rounded-md">Start</button>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
}

export default SellerTasks;
