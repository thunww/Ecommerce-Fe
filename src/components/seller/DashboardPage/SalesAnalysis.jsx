// FE/src/components/vendor/SalesAnalytics.jsx
import React, { useState, useEffect } from 'react';
import revenueApi from '../../../api/VendorAPI/revenueApi';
import shopApi from '../../../api/VendorAPI/shopApi';

const SalesAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    revenue: 0,
    visits: 0,
    views: 0,
    orders: 0,
    conversionRate: 0,
    revenueByStatus: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debug, setDebug] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check token
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('Please login again');
        }

        console.log('Token:', token);

        // Call API to get revenue
        const revenueResponse = await revenueApi.getRevenue();
        console.log('Revenue API Response:', revenueResponse);
        
        // Call API to get shop info
        const shopResponse = await shopApi.getShopInfo();
        console.log('Shop API Response:', shopResponse);

        // Parse and validate numeric values
        const revenue = parseFloat(revenueResponse?.data?.totalRevenue) || 0;
        const orders = parseInt(revenueResponse?.data?.totalOrders) || 0;
        const views = parseInt(shopResponse?.data?.views) || 0;
        const visits = Math.round(views * 0.7);
        const conversionRate = visits > 0 ? ((orders / visits) * 100).toFixed(2) : 0;

        const debugInfo = {
          revenueResponse,
          shopResponse,
          calculatedValues: {
            revenue,
            orders,
            views,
            visits,
            conversionRate
          }
        };
      
        // setDebug(debugInfo);

        setAnalytics({
          revenue,
          visits,
          views,
          orders,
          conversionRate,
          revenueByStatus: revenueResponse?.data?.deliveredOrders || []
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Unable to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
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
          {debug && (
            <pre className="mt-4 text-left text-xs bg-gray-100 p-4 rounded">
              {JSON.stringify(debug, null, 2)}
            </pre>
          )}
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
            {formatCurrency(analytics.revenue)}
          </p>
          <p className="text-sm text-gray-500">Revenue</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-800">
            {analytics.visits.toLocaleString('en-US')}
          </p>
          <p className="text-sm text-gray-500">Visits</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-800">
            {analytics.views.toLocaleString('en-US')}
          </p>
          <p className="text-sm text-gray-500">Views</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-800">
            {analytics.orders.toLocaleString('en-US')}
          </p>
          <p className="text-sm text-gray-500">Orders</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-800">
            {analytics.conversionRate}%
          </p>
          <p className="text-sm text-gray-500">Conversion Rate</p>
        </div>
      </div>
      {debug && (
        <pre className="mt-4 text-xs bg-gray-100 p-4 rounded">
          {JSON.stringify(debug, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default SalesAnalytics;