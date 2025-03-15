import React, { useState, useEffect, useReducer, useRef } from "react";
import { useNavigate } from "react-router-dom";
import StatsCards from "../components/Header/StatsCards";
import OrdersTable from "../components/Header/OrdersTable";


const initialState = {

  stats: {
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  },
  recentOrders: [],
  loading: true,
  notifications: [],
  showNotifications: false,
  isOnline: true,
  showUserMenu: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_STATS":
      return { ...state, stats: action.payload, loading: false };
    case "SET_ORDERS":
      return { ...state, recentOrders: action.payload, loading: false };
    case "SET_NOTIFICATIONS":
      return { ...state, notifications: action.payload };
    case "TOGGLE_NOTIFICATIONS":
      return { ...state, showNotifications: !state.showNotifications };
    case "TOGGLE_ONLINE":
      return { ...state, isOnline: !state.isOnline };
    case "TOGGLE_USER_MENU":
      return { ...state, showUserMenu: !state.showUserMenu };
    default:
      return state;
  }
};

const Dashboard = () => {
  console.log("Con meo");

  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/orders/stats");
        if (!response.ok) throw new Error("Lỗi khi tải dữ liệu!");

        const data = await response.json();
        dispatch({
          type: "SET_STATS",
          payload: {
            totalOrders: data.totalOrders,
            completedOrders: data.completedOrders,
            pendingOrders: data.pendingOrders,
            totalRevenue: data.totalRevenue,
          },
        });
        dispatch({ type: "SET_ORDERS", payload: data.recentOrders || [] });
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex-1 flex flex-col relative">
      {/* Main Content */}
      <main className="p-6">
        <p className="text-gray-600">Xin chào, đây là bảng điều khiển giao hàng của bạn.</p>

        {/* Stats Cards */}
        <div className="mt-6">
          <StatsCards stats={state.stats} />
        </div>

        {/* Orders Table */}
        <div className="mt-8">
          <OrdersTable />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
