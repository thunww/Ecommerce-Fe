import React from "react";
import { Routes, Route } from "react-router-dom";
import ShipperLayout from "../layouts/ShipperLayout";
import ShipperDashboard from "../pages/Shipper/ShipperDashboard";
import ShipperOrders from "../pages/Shipper/ShipperOrders";
import ShipperProfile from "../pages/Shipper/ShipperProfile";
import ShipperOrderDetail from "../pages/Shipper/ShipperOrderDetail";
import ShipperLanding from "../pages/Shipper/ShipperLanding";
import ShipperIncome from "../pages/Shipper/ShipperIncome";
import ShipperRegister from "../pages/Shipper/ShipperRegister";
import NotFound from "../pages/NotFound";

const ShipperRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<ShipperLanding />} />
      <Route path="/register" element={<ShipperRegister />} />
      {/* <Route path="/login" element={<ShipperLogin />} /> */}

      {/* Protected routes with layout */}
      <Route element={<ShipperLayout />}>
        <Route path="/dashboard" element={<ShipperDashboard />} />
        <Route path="/orders" element={<ShipperOrders />} />
        <Route path="/orders/:orderId" element={<ShipperOrderDetail />} />
        <Route path="/profile" element={<ShipperProfile />} />
        <Route path="/income" element={<ShipperIncome />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ShipperRoutes;
