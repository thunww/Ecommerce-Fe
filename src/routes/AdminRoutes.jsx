import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Admin/Dashboard";
import Users from "../pages/Admin/ManageUsers";
import ManageOrders from "../pages/Admin/ManageOrders";
import ManageProducts from "../pages/Admin/ManageProducts";
import ManageUsers from "../pages/Admin/ManageUsers";
import AdminOverview from "../pages/Admin/AdminOverview";
import EditUser from "../pages/Admin/EditUsers";

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Bọc trong AdminLayout */}
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />{" "}
        {/* Mặc định hiển thị Dashboard */}
        <Route path="users" element={<ManageUsers />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="orders" element={<ManageOrders />} />
        <Route path="overview" element={<AdminOverview />} />
        <Route path="edit-user/:user_id" element={<EditUser />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
