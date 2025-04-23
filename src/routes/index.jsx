import { Routes, Route } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";
import CustomerRoutes from "./CustomerRoutes";
import PrivateRoute from "./PrivateRoute";
import ShipperRoutes from "./ShipperRoutes";
import ShipperRegister from "../pages/Shipper/ShipperRegister";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes cho Admin */}
      <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Route>

      {/* Route đăng ký shipper - không cần xác thực */}
      <Route path="/shipper/register" element={<ShipperRegister />} />

      {/* Routes cho Shipper */}
      <Route element={<PrivateRoute allowedRoles={["shipper"]} />}>
        <Route path="/shipper/*" element={<ShipperRoutes />} />
      </Route>
      {/* Routes cho Khách hàng */}
      <Route path="/*" element={<CustomerRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
