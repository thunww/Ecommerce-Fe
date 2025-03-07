import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Admin/Dashboard";
import Users from "../pages/Admin/ManageUsers";
import ManageOrders from "../pages/Admin/ManageOrders";
import ManageProducts from "../pages/Admin/ManageProducts";

const AdminRoutes = () => {
    return (
        <Routes>
            {/* Bọc trong AdminLayout */}
            <Route path="/" element={<AdminLayout />}>
                <Route index element={<Dashboard />} /> {/* Mặc định hiển thị Dashboard */}
                <Route path="users" element={<Users />} />
                <Route path="products" element={<ManageProducts />} />
                <Route path="orders" element={<ManageOrders />} />
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
