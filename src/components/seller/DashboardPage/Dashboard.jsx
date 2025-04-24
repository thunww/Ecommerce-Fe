import React, { Component } from "react";
import ToDoList from "../DashboardPage/TodoList";
import SalesAnalytics from "../DashboardPage/SalesAnalysis";
import ShopeeAds from "../DashboardPage/Ads";
import KOLOrders from "../DashboardPage/KolOrders";
import Livestream from "../DashboardPage/Livestream";
import SellerTasks from "../DashboardPage/SellerMissions";
import FeaturedNews from "../DashboardPage/FeaturedNews";
import Campaigns from "../DashboardPage/Campaigns";
import SalesPerformance from "../DashboardPage/SalesPerformance";
import AdvertisementCarousel from "./AdvertisementCarousel_KOL";
import AdvertisementLivestream from "./AdvertisementCarousel_Livestream";

class Dashboard extends Component {
  render() {
    return (
      <div className="flex flex-col min-h-screen p-6 bg-gray-100 w-full h-full ">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full h-full">
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

            {/* Boost Orders with KOL & Livestream */}
            <div className="grid grid-cols-2 gap-4 w-full">
              {/* Boost Orders with KOL (2 cột) */}
              <div className="p-4 bg-white rounded-lg shadow w-full flex">
                <div className="w-1/2 pr-4 max-w-[500px]">
                  <KOLOrders />
                </div>
                <div className="w-1/2 flex items-center justify-center h-[360px]">
                  <AdvertisementCarousel />
                </div>
              </div>

              {/* Livestream (2 hàng) */}
              <div className="p-4 bg-white rounded-lg shadow w-full flex flex-col">
                <div className="mb-4">
                  <Livestream />
                </div>
                <div className="flex items-center justify-center">
                  <AdvertisementLivestream />
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow w-full overflow-hidden break-words mb-8">
              <Campaigns />
            </div>
          </div>

          {/* Cột 2 */}
          <div className="space-y-4 w-full">
            <div className="p-4 bg-white rounded-lg shadow w-full overflow-hidden break-words">
              <SalesPerformance />
            </div>
            <div className="p-4 bg-white rounded-lg shadow w-full overflow-hidden break-words">
              <FeaturedNews />
            </div>
            <div className="p-4 bg-white rounded-lg shadow w-full overflow-hidden break-words">
              <SellerTasks />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
