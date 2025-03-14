import { Routes, Route } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";
import CustomerRoutes from "./CustomerRoutes";
import VendorRoutes from "./VendorRoutes";


const AppRoutes = () => {
    return (
        <Routes>
            {/* Routes cho từng vai trò */}
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* Routes cho Khách hàng */}
            <Route path="/*" element={<CustomerRoutes />} />
            {/* Routes dành cho người bán */}
            <Route path="/vendor/*" element={<VendorRoutes />} />
        </Routes>
    );
};

export default AppRoutes;
