import { Routes, Route } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";
import CustomerRoutes from "./CustomerRoutes";
import PrivateRoute from "./PrivateRoute";
import ShipperRoutes from "./ShipperRoutes";
import VendorRoutes from "./VendorRoutes";
const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes cho Admin */}
      <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Route>

      {/* Routes cho Shipper */}
      <Route element={<PrivateRoute allowedRoles={["shipper"]} />}>
        <Route path="/shipper/*" element={<ShipperRoutes />} />
      </Route>
      <Route element={<PrivateRoute allowedRoles={["vendor"]} />}>
        <Route path="/vendor/*" element={<VendorRoutes />} />
      </Route>

      {/* Routes cho Khách hàng */}
      <Route path="/*" element={<CustomerRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
