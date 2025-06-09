import { Routes, Route } from "react-router-dom";
import VendorLayout from "../layouts/vendorLayout/Layout";

import Dashboard from "../pages/Vendor/Dashboard";
import Orders from "../pages/Vendor/Orders";
import Products from "../pages/Vendor/Products";
import AnalyticsPage from "../pages/Vendor/Analytics";
import Settings from "../pages/Vendor/Setting";
import NotFound from "../pages/Vendor/NotFound";
import BulkShippingPage from "../pages/Vendor/bulk-shipping";
import UserProfile from "../components/seller/ShopProfile/UserProfile";
import DetailOrder from "../components/seller/AllOrder/DetailOrder";
import EditOrder from "../pages/Vendor/EditOrder";
import UpdateProduct from "../components/seller/Productpage/HomeProduct/UpdateProduct";
import AddProduct from "../components/seller/Productpage/AddProduct/AddProduct";
import ShopPage from "../components/customer/Components/ShopPage/ShopDetail";
import ShopProfile from "../components/seller/ShopProfile/ShopProfile"

const VendorRoutes = () => {
  return (
    <Routes>
      
      <Route path="shop-profile" element={<ShopProfile />} />
      {/* Bọc tất cả route trong VendorLayout */}
      <Route path="/" element={<VendorLayout />}>
        <Route index element={<Dashboard />} />

        <Route path="orders" element={<Orders />} />
        <Route path="orders/detailOrder" element={<DetailOrder />} />
        <Route path="orders/edit/:productId" element={<EditOrder />} />
        <Route path="bulk-shipping" element={<BulkShippingPage />} />
        
        <Route path="products" element={<Products />} />
        <Route path="products/edit/:productId" element={<UpdateProduct />} />
        <Route path="products/add" element={<AddProduct />} />
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
