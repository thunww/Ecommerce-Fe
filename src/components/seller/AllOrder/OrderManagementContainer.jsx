import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import HeaderActions from "./HeaderActions";
import MainTabs from "./MainTabs";
import StatusTabs from "./StatusTabs";
import SearchFilters from "./SearchFilters/SearchFilters";
import OrderSummary from "./OrderSummary/OrderSummary";
import OrderTable from "./OrderTable/OrderTable";

const OrderManagementContainer = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "waiting-for-pickup";

  const [activeSubTab, setActiveSubTab] = useState("unprocessed");
  const [searchOrderCode, setSearchOrderCode] = useState("");
  const [shippingUnit, setShippingUnit] = useState("All Carriers");
  const [sortOption, setSortOption] = useState("Package Order (Farthest - Nearest)");
  const [orders, setOrders] = useState([]); // Giả định ban đầu không có đơn hàng

  useEffect(() => {
    console.log("Tab changed:", activeTab);
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setSearchParams({ tab }); // Cập nhật URL
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow w-full max-w-50xl mx-auto h-[800px]">
      <HeaderActions />

      <MainTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <StatusTabs activeSubTab={activeSubTab} onSubTabChange={setActiveSubTab} />

      <SearchFilters
        searchOrderCode={searchOrderCode}
        shippingUnit={shippingUnit}
        onSearchChange={(field, value) => {
          if (field === "searchOrderCode") setSearchOrderCode(value);
          if (field === "shippingUnit") setShippingUnit(value);
        }}
      />

      <OrderSummary orderCount={orders.length} sortOption={sortOption} onSortChange={setSortOption} />

      <OrderTable orders={orders} />
    </div>
  );
};

export default OrderManagementContainer;
