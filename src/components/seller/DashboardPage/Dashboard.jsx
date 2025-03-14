import React, { Component } from "react";
import ToDoList from "../DashboardPage/TodoList";
import SalesAnalytics from "../DashboardPage/SalesAnalysis";
import ShopeeAds from "../DashboardPage/Ads";
import KOLOrders from "../DashboardPage/KolOrders";
import Livestream from "../DashboardPage/Livestream";
import SellerTasks from "../DashboardPage/SellerMissions";
import FeaturedNews from "../DashboardPage/FeaturedNews";
import Campaigns from "../DashboardPage/Campaigns";
import SellerPerformance from "../DashboardPage/SellerPerformance"; 

class Dashboard extends Component {
  render() {
    return (
      <div className="p-6 bg-gray-100 min-h-screen grid gap-4 
                      grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
        
        {/* Cột 1 */}
        <div className="col-span-2 space-y-4 w-full">
          <div className="p-4 bg-white rounded-lg shadow w-full overflow-hidden break-words">
            <ToDoList />
          </div>
          <div className="p-4 bg-white rounded-lg shadow w-full overflow-hidden break-words">
            <SalesAnalytics />
          </div>
          <div className="p-4 bg-white rounded-lg shadow w-full overflow-hidden break-words">
            <ShopeeAds />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <div className="p-4 bg-white rounded-lg shadow w-full overflow-hidden break-words">
              <KOLOrders />
            </div>
            <div className="p-4 bg-white rounded-lg shadow w-full overflow-hidden break-words">
              <Livestream />
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow w-full overflow-hidden break-words">
            <Campaigns />
          </div>
        </div>

        {/* Cột 2 */}
        <div className="space-y-4 w-full">
          <div className="p-4 bg-white rounded-lg shadow w-full overflow-hidden break-words">
            <SellerPerformance />
          </div>
          <div className="p-4 bg-white rounded-lg shadow w-full overflow-hidden break-words">
            <FeaturedNews />
          </div>
          <div className="p-4 bg-white rounded-lg shadow w-full overflow-hidden break-words">
            <SellerTasks />
          </div>
        </div>

      </div>
    );
  }
}

export default Dashboard;
