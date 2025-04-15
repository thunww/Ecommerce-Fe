import { Routes, Route } from "react-router-dom";
import VendorLayout from "../layouts/vendorLayout/Layout";

import Dashboard from "../pages/Vendor/Dashboard";
import Orders from "../pages/Vendor/Orders";
import Products from "../pages/Vendor/Products";
import AnalyticsPage from "../pages/Vendor/Analytics";
import Settings from "../pages/Vendor/Setting";
import NotFound from "../pages/Vendor/NotFound";
import BulkShippingPage from "../pages/Vendor/bulk-shipping";
import AddProductPage from "../pages/Vendor/AddProduct";
import ShopProfile from "../components/seller/ShopProfile/ShopProfile";
import UserProfile from "../components/seller/ShopProfile/UserProfile";

const VendorRoutes = () => {
  return (
    <Routes>
      {/* Bọc tất cả route trong VendorLayout */}
      <Route path="/" element={<VendorLayout />}>
        <Route index element={<Dashboard />} />

        <Route path="orders" element={<Orders />} />
        <Route path="bulk-shipping" element={<BulkShippingPage />} />

        <Route path="products" element={<Products />} />
        <Route path="products/add" element={<AddProductPage />} />
        <Route path="products/settings" element={<Settings />} />
        <Route path="shop-profile" element={<ShopProfile />} />
        <Route path="user-profile" element={<UserProfile />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default VendorRoutes;
