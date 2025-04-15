import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import HeaderActions from "./HeaderActions";
import MainTabs from "./MainTabs";
import OrderSummary from "./OrderSummary/OrderSummary";
import OrderTable from "./OrderTable/OrderTable";
import { useSelector } from "react-redux";
import {
  getShopOrderedProducts,
  getShopInfo,
} from "../../../services/vendorService";

const OrderManagementContainer = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "all";
  const user = useSelector((state) => state.auth?.user);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shopInfo, setShopInfo] = useState(null);
  const [activeStatus, setActiveStatus] = useState("all");

  // Lấy thông tin shop
  useEffect(() => {
    const fetchShopInfo = async () => {
      try {
        setLoading(true);
        const shopData = await getShopInfo();
        console.log("Shop Info Response:", shopData);

        if (shopData) {
          // Log để kiểm tra cấu trúc dữ liệu
          console.log("Shop Data Structure:", {
            fullData: shopData,
            id: shopData.shop_id,
          });

          setShopInfo(shopData); // Set trực tiếp shopData
        }
      } catch (err) {
        setError("Could not get shop information: " + err.message);
        console.error("Error fetching shop info:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.roles?.includes("vendor")) {
      fetchShopInfo();
    }
  }, [user]);

  // Lấy danh sách đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      // Log để debug
      console.log("Current Shop Info in fetchOrders:", shopInfo);

      // Lấy shop_id từ shopInfo
      const currentShopId = shopInfo?.shop_id;
      console.log("Current Shop ID:", currentShopId);

      if (!currentShopId) {
        console.log("No shop_id available", shopInfo);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log("Fetching orders for shop:", currentShopId);
        const ordersData = await getShopOrderedProducts(currentShopId);
        console.log("Orders Data:", ordersData);

        if (Array.isArray(ordersData)) {
          console.log("Setting orders:", ordersData);
          setOrders(ordersData);
        } else {
          console.error("Invalid orders data structure:", ordersData);
          setError("Invalid order data structure");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    if (shopInfo?.shop_id) {
      // Chỉ gọi khi có shop_id
      fetchOrders();
    }
  }, [shopInfo]);

  // Xử lý thay đổi tab và status
  const handleStatusChange = (status) => {
    console.log("Changing status to:", status);
    setActiveStatus(status);
  };

  // Add this function to refresh orders when status is updated
  const handleOrderUpdated = async () => {
    try {
      if (shopInfo?.shop_id) {
        setLoading(true);
        setError(null);

        console.log("Refreshing orders after status update...");
        const refreshedOrders = await getShopOrderedProducts(shopInfo.shop_id);

        if (Array.isArray(refreshedOrders)) {
          setOrders(refreshedOrders);
          console.log("Orders refreshed successfully:", refreshedOrders);
        } else {
          console.error("Invalid orders data structure:", refreshedOrders);
          setError("Invalid order data structure");
        }
      }
    } catch (err) {
      setError(err.message);
      console.error("Error refreshing orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Lọc đơn hàng dựa trên các điều kiện
  const filteredOrders = orders.filter((order) => {
    // Lọc theo trạng thái
    if (activeStatus === "all") return true;

    console.log(
      "Filtering by status:",
      activeStatus,
      "Order status:",
      order.latest_order_status
    );
    return order.latest_order_status === activeStatus;
  });

  // Sắp xếp đơn hàng (chỉnh sửa thành sắp xếp theo thời gian mới nhất)
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    return new Date(b.latest_order_date) - new Date(a.latest_order_date);
  });

  if (!user?.roles?.includes("vendor")) {
    return (
      <div className="text-center py-4 text-red-500">
        You do not have permission to access this page
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow w-full">
      <HeaderActions
        activeStatus={activeStatus}
        onStatusChange={handleStatusChange}
      />

      <MainTabs onStatusChange={handleStatusChange} />

      <OrderSummary orderCount={sortedOrders.length} />

      {loading && <div className="text-center py-4">Loading...</div>}
      {error && (
        <div className="text-red-500 text-center py-4">Error: {error}</div>
      )}
      {!loading && !error && (
        <div className="w-full overflow-x-auto">
          <div className="min-w-full">
            <OrderTable
              orders={sortedOrders}
              onOrderUpdated={handleOrderUpdated}
            />
          </div>
          {sortedOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No orders found matching the filter
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderManagementContainer;
