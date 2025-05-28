import React, { Component } from "react";
import { FaRocket, FaChartLine, FaArrowRight, FaBullhorn } from "react-icons/fa";

class ShopeeAds extends Component {
  render() {
    return (
      <div className="relative bg-white p-6 rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100/30 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-50/50 rounded-full translate-y-12 -translate-x-12"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header with icon */}
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl mr-3 shadow-lg">
              <FaBullhorn className="w-6 h-6 text-white" />
            </div>
            <h2 className="font-bold text-2xl text-gray-800">Shopee Ads</h2>
          </div>
          
          {/* Description */}
          <p className="text-gray-600 text-lg mb-6 leading-relaxed">
            Maximize your sales with targeted advertising. 
            <br />
            <span className="text-gray-500 text-base">Reach millions of customers and boost your revenue.</span>
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <FaRocket className="w-4 h-4 mr-2 text-orange-500" />
              <span className="text-sm">Boost Sales</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaChartLine className="w-4 h-4 mr-2 text-blue-500" />
              <span className="text-sm">Track Performance</span>
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="flex items-center justify-between">
            <div className="text-gray-500 text-sm">
              Start from <span className="font-bold text-gray-700 text-lg">$10/day</span>
            </div>
            {/* <a 
              href="#" 
              className="group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 flex items-center shadow-lg"
            >
              Learn More
              <FaArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </a> */}
          </div>
        </div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/20 to-transparent -skew-x-12 translate-x-full animate-pulse"></div>
      </div>
    );
  }
}

export default ShopeeAds;