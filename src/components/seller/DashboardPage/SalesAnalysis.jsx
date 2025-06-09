import React, { useState, useEffect } from "react";
import revenueApi from "../../../api/VendorAPI/revenueApi";
import shopApi from "../../../api/VendorAPI/shopApi";

const SalesAnalytics = () => {
  const [revenueAnalytics, setRevenueAnalytics] = useState({
    revenue: 0,
    orders: 0,
    revenueByStatus: [],
  });

  const [shopAnalytics, setShopAnalytics] = useState({
    views: 0,
    visits: 0,
    conversionRate: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check token
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("Please login again");
        }

        // Call API to get revenue
        const revenueResponse = await revenueApi.getRevenue();

        // Call API to get shop info
        const shopResponse = await shopApi.getShopInfo();

        // Parse revenue data
        const revenue = parseFloat(revenueResponse?.data?.totalRevenue) || 0;
        const totalOrders = parseInt(revenueResponse?.data?.totalOrders) || 0;

        // Parse shop data
        const views = parseInt(shopResponse?.data?.data?.views) || 0;
        const visits = Math.round(views * 0.7); // Assumption: 70% of views are unique visits
        const deliveredOrders =
          parseFloat(shopResponse?.data?.data?.order_stats?.delivered) || 0;
        const conversionRate =
          visits > 0 ? ((deliveredOrders / visits) * 100).toFixed(2) : 0;

        setRevenueAnalytics({
          revenue,
          orders: totalOrders,
          revenueByStatus: revenueResponse?.data?.deliveredOrders || [],
        });

        setShopAnalytics({
          views,
          visits,
          conversionRate,
        });
      } catch (error) {
        setError(error.message || "Unable to load statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-red-500 py-4">
          <p className="font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Sales Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-800">
            {formatCurrency(revenueAnalytics.revenue)}
          </p>
          <p className="text-sm text-gray-500">Revenue</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-800">
            {shopAnalytics.visits.toLocaleString("en-US")}
          </p>
          <p className="text-sm text-gray-500">Visits</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-800">
            {shopAnalytics.views.toLocaleString("en-US")}
          </p>
          <p className="text-sm text-gray-500">Views</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-800">
            {revenueAnalytics.orders.toLocaleString("en-US")}
          </p>
          <p className="text-sm text-gray-500">Orders</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-800">
            {shopAnalytics.conversionRate}%
          </p>
          <p className="text-sm text-gray-500">Conversion Rate</p>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
