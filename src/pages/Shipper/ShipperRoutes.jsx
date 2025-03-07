import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Profile from "./pages/Profile";

const ShipperLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const ShipperRoutes = () => {
  return (
    <Routes>
      {/* Điều hướng từ /shipper sang /shipper/dashboard */}
      <Route path="/shipper" element={<Navigate to="/shipper/dashboard" replace />} />
      
      <Route path="/shipper" element={<ShipperLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default ShipperRoutes;
