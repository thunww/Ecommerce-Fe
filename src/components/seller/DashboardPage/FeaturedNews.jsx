import React, { Component } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";

class FeaturedNews extends Component {
  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Featured News</CardTitle>
        </CardHeader>
        <CardContent>
          <img
            src="https://via.placeholder.com/300x100"
            alt="News Banner"
            className="w-full h-auto rounded-lg"
          />
          <p className="mt-2 text-gray-700">
            Join Shopee's latest updates and stay informed!
          </p>
          <div className="text-blue-500 cursor-pointer hover:underline mt-2">
            View More
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default FeaturedNews;
