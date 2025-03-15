import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "../pages/Shipper/components/Layout";
import Dashboard from "../pages/Shipper/pages/Dashboard";
import Orders from "../pages/Shipper/pages/Orders";
import OrderDetail from "../pages/Shipper/pages/OrderDetail";
import Profile from "../pages/Shipper/pages/Profile";

const ShipperLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const ShipperRoutes = () => {
  return (
    <Routes> {/* ✅ KHÔNG có Router ở đây */}
      <Route path="/" element={<Navigate to="/shipper/dashboard" replace />} />

      <Route path="/shipper" element={<ShipperLayout />}>
        <Route index element={<Navigate to="/shipper/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default ShipperRoutes;
