import { Routes, Route } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";
import CustomerRoutes from "./CustomerRoutes";
import TestApi from "../pages/Customer/TestApi";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Routes cho từng vai trò */}
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* Routes cho Khách hàng */}
            <Route path="/*" element={<CustomerRoutes />} />

            <Route path="/test-api" element={<TestApi />} />
        </Routes>
    );
};

export default AppRoutes;
