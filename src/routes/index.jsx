import { Routes, Route } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";
import CustomerRoutes from "./CustomerRoutes";
import PrivateRoute from "./PrivateRoute";
import ShipperRoutes from "./ShipperRoutes";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Routes cho Admin */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
                <Route path="/admin/*" element={<AdminRoutes />} />
            </Route>

            {/* Routes cho Shipper */}
            <Route path="/shipper/*" element={<ShipperRoutes />} />
            

            {/* Routes cho Khách hàng */}
            <Route path="/*" element={<CustomerRoutes />} />
        </Routes>
    );
};

export default AppRoutes;
