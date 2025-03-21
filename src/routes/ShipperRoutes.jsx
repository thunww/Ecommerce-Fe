import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ShipperLayout from "../layouts/ShipperLayout";
import ShipperDashboard from "../pages/Shipper/ShipperDashboard";
import ShipperOrders from "../pages/Shipper/ShipperOrders";
import ShipperProfile from "../pages/Shipper/ShipperProfile";
import ShipperOrderDetail from "../pages/Shipper/ShipperOrderDetail";
import ShipperLanding from "../pages/Shipper/ShipperLanding";
import ShipperIncome from "../pages/Shipper/ShipperIncome";
import ShipperRegister from '../pages/ShipperRegister';
import NotFound from "../pages/NotFound";

const ShipperRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/shipper" element={<ShipperLanding />} />
      <Route path="/shipper/register" element={<ShipperRegister />} />

      {/* Protected routes with layout */}
      <Route path="/shipper" element={<ShipperLayout />}>
        <Route path="dashboard" element={<ShipperDashboard />} />
        <Route path="orders" element={<ShipperOrders />} />
        <Route path="orders/:id" element={<ShipperOrderDetail />} />
        <Route path="profile" element={<ShipperProfile />} />
        <Route path="income" element={<ShipperIncome />} />
      </Route>

      {/* Redirect root to shipper landing */}
      <Route path="/" element={<Navigate to="/shipper" replace />} />

      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ShipperRoutes;
