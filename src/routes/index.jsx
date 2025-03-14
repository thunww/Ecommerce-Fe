import { Routes, Route } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";
// import CustomerRoutes from "./CustomerRoutes";


const AppRoutes = () => {
    return (
        <Routes>
            {/* Routes cho từng vai trò */}
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* Routes cho Khách hàng */}
            {/* <Route path="/*" element={<CustomerRoutes />} /> */}

        </Routes>
    );
};

export default AppRoutes;
