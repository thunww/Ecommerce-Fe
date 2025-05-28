import React, { Component } from "react";

class KOLOrders extends Component {
  render() {
    return (
      <div className="bg-white p-4 rounded-xl shadow border w-120  h-[360px] overflow-hidden">
        <div className="flex justify-between">
          <h2 className="font-bold text-lg">Boost Orders with KOL</h2>
        </div>
        <div className="bg-red-100 text-red-700 p-2 rounded mt-2">
          Only pay for successful orders brought by KOLs!
        </div>
        <p className="mt-2">Set commission for your shop's advertisements</p>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <input type="number" className="border p-1 w-16 text-center" defaultValue="9" />
          <span>Suggested: 9% - 14%</span>
          <button className="bg-green-500 text-white px-2 py-1 rounded flex-shrink-0 w-fit">
            ✔
          </button>
        </div>
        <p className="mt-2 text-green-500">Potential Revenue: +24% 📈</p>
      </div>
    );
  }
}

export default KOLOrders;