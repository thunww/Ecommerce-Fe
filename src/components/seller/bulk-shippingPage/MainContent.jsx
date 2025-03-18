import React from "react";
import Header from "./Header";
import Filter from "./Filter";
import ParcelList from "./ParcelList";
import ShippingInfo from "./ShippingInfo";

const BulkShipping = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Header />
      <div className="grid grid-cols-3 gap-6 mt-4">
        <div className="col-span-2">
          {/* Thêm bg-white và shadow cho phần Filter và ParcelList */}
          <div className="bg-white shadow rounded-lg">
            <Filter />
            <ParcelList />
          </div>
        </div>
        <ShippingInfo />
      </div>
    </div>
  );
};

export default BulkShipping;
