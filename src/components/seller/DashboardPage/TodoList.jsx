import React, { useState, useEffect } from "react";
import { getAllOrders, getRevenue } from "../../../services/vendorService";

const ToDoList = () => {
  const [orderCounts, setOrderCounts] = useState({
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  });
  const [debug, setDebug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Debug authentication info
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('You are not logged in');
        }
        
        // Get user from localStorage
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          throw new Error('User information not found');
        }
        
        const user = JSON.parse(userStr);
        if (!user || !user.user_id) {
          throw new Error('Invalid user information');
        }

        // Check user role
        const roles = JSON.parse(localStorage.getItem('roles') || '[]');
        if (!roles.includes('vendor')) {
          throw new Error('You do not have permission to access this page');
        }

        const response = await getAllOrders(user.user_id);
        
        
        // Get revenue
        const revenue = await getRevenue(user.user_id);
        
        // Lưu response để debug
        // setDebug({
        //   token: "Có token",
        //   user: user,
        //   response: response,
        //   revenue: revenue,
        //   timestamp: new Date().toISOString()
        // });
        
        // Kiểm tra response
        if (!response || !Array.isArray(response)) {
          throw new Error('Invalid data from server');
        }

        // Đếm số lượng đơn hàng theo trạng thái
        const counts = response.reduce((acc, order) => {
          const status = order.status?.toLowerCase() || '';
          if (status in acc) {
            acc[status] += 1;
          }
          return acc;
        }, {
          pending: 0,
          processing: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0
        });

        
        setOrderCounts(counts);

      } catch (error) {
        
        setError(error.message || 'Error loading data');
        setDebug({ 
          error: error.message,
          stack: error.stack,
          token: localStorage.getItem('accessToken') ? "Has token" : "No token",
          user: localStorage.getItem('user'),
          timestamp: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-medium">Error: {error}</p>
          {debug && (
            <details className="mt-2">
              <summary className="text-sm text-gray-600 cursor-pointer">View details</summary>
              <pre className="mt-2 text-xs bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(debug, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Order List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <p className="text-2xl font-bold text-blue-600">{orderCounts.pending}</p>
          <p className="text-sm text-gray-500">Pending</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <p className="text-2xl font-bold text-yellow-600">{orderCounts.processing}</p>
          <p className="text-sm text-gray-500">Processing</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <p className="text-2xl font-bold text-purple-600">{orderCounts.shipped}</p>
          <p className="text-sm text-gray-500">Shipped</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <p className="text-2xl font-bold text-green-600">{orderCounts.delivered}</p>
          <p className="text-sm text-gray-500">Delivered</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <p className="text-2xl font-bold text-red-600">{orderCounts.cancelled}</p>
          <p className="text-sm text-gray-500">Cancelled</p>
        </div>
      </div>
      {process.env.NODE_ENV === 'development' && debug && (
        <details className="mt-4">
          <summary className="text-sm text-gray-600 cursor-pointer">Debug Info</summary>
          <pre className="mt-2 text-xs bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(debug, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default ToDoList;
