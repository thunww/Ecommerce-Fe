import { Routes, Route } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/ManageUsers";
import ManageProducts from "./pages/ManageProducts";
import ManageOrders from "./pages/ManageOrders";

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="products" element={<ManageProducts />} />
                <Route path="orders" element={<ManageOrders />} />
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
