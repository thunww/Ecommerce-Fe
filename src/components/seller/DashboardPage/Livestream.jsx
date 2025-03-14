import React, { Component } from "react";

class Livestream extends Component {
  render() {
    return (
      <div className="bg-white p-4 rounded-xl shadow border">
        <div className="flex justify-between">
          <h2 className="font-bold text-lg">Livestream</h2>
          <a href="#" className="text-blue-500">See more</a>
        </div>
        <div className="bg-orange-100 text-orange-700 p-2 rounded mt-2">
          <p className="font-bold">Start Livestream Now</p>
          <p>Increase your conversion rate by <span className="text-red-500">2x!</span></p>
        </div>
        <button className="bg-red-500 text-white px-4 py-2 rounded mt-2">
          Start Livestream
        </button>
      </div>
    );
  }
}

export default Livestream;
