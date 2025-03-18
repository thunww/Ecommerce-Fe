import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ShipperLayout from "../layouts/ShipperLayout";
import ShipperDashboard from "../pages/Shipper/ShipperDashboard";
import ShipperOrders from "../pages/Shipper/ShipperOrders";
import ShipperOrderDetail from "../pages/Shipper/ShipperOrderDetail";
import ShipperProfile from "../pages/Shipper/ShipperProfile";

// Component để xử lý route không hợp lệ
const NotFound = () => {
  const location = useLocation();
  
  // Nếu path bắt đầu bằng /shipper nhưng không hợp lệ
  if (location.pathname.startsWith('/shipper/')) {
    return <Navigate to="/shipper/dashboard" replace />;
  }
  
  // Các path khác
  return <Navigate to="/shipper/dashboard" replace />;
};

const ShipperRoutes = () => {
  return (
    <Routes>
      {/* Root path redirect */}
      <Route path="/" element={<Navigate to="/shipper/dashboard" replace />} />

      {/* Shipper routes */}
      <Route path="/shipper" element={<ShipperLayout />}>
        {/* Default redirect */}
        <Route index element={<Navigate to="dashboard" replace />} />
        
        {/* Main routes */}
        <Route path="dashboard" element={<ShipperDashboard />} />
        <Route path="orders" element={<ShipperOrders />} />
        <Route path="orders/:id" element={<ShipperOrderDetail />} />
        <Route path="profile" element={<ShipperProfile />} />
      </Route>

      {/* Handle all unknown routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ShipperRoutes;
