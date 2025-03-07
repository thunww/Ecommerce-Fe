import { Routes, Route } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";


const AppRoutes = () => {
    return (
        <Routes>
            {/* Routes cho từng vai trò */}
            <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
    );
};

export default AppRoutes;
