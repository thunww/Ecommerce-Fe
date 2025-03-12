import { Routes, Route } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";
import CustomerRoutes from "./CustomerRoutes";
import Home from "../pages/Customer/Pages/Home";


const AppRoutes = () => {
    return (
        <Routes>
            {/* Routes cho từng vai trò */}
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* Routes cho Khách hàng */}
            <Route path="/" element={<Home />} />
        </Routes>
    );
};

export default AppRoutes;
