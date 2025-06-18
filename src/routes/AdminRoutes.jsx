import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Admin/Dashboard";
import Users from "../pages/Admin/ManageUsers";
import ManageProducts from "../pages/Admin/ManageProducts";
import ManageUsers from "../pages/Admin/ManageUsers";
import AdminOverview from "../pages/Admin/AdminOverview";
import ViewUserDetails from "../pages/Admin/ViewUserDetails";
import ManageShops from "../pages/Admin/ManageShops";
import ManageCategory from "../pages/Admin/ManageCategory";
import ManageShippers from "../pages/Admin/ManageShipper";
import ManageReviews from "../pages/Admin/ManageReviews";
const AdminRoutes = () => {
  return (
    <Routes>
      {/* Bọc trong AdminLayout */}
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />{" "}
        {/* Mặc định hiển thị Dashboard */}
        <Route path="users" element={<ManageUsers />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="overview" element={<AdminOverview />} />
        <Route path="view-user/:user_id" element={<ViewUserDetails />} />
        <Route path="shops" element={<ManageShops />} />
        <Route path="categories" element={<ManageCategory />} />
        <Route path="shippers" element={<ManageShippers />} />
        <Route path="reviews" element={<ManageReviews />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
