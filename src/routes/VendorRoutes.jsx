import { Routes, Route } from "react-router-dom";
import VendorLayout from "../layouts/vendorLayout/Layout";

import Dashboard from "../pages/Vendor/Dashboard";
import Orders from "../pages/Vendor/Orders";
import Products from "../pages/Vendor/Products";
import ProductDetail from "../pages/Vendor/ProductDetail";
import AddProduct from "../pages/Vendor/AddProduct";
import EditProduct from "../pages/Vendor/EditProduct";
import AnalyticsPage from "../pages/Vendor/Analytics";
import Settings from "../pages/Vendor/Setting";
import NotFound from "../pages/Vendor/NotFound";
import BulkShippingPage from "../pages/Vendor/bulk-shipping";

const VendorRoutes = () => {
  return (
    <Routes>
      {/* Bọc tất cả route trong VendorLayout */}
      <Route path="/" element={<VendorLayout />}>
         <Route index element={<Dashboard/>} />  
         
        <Route path="orders" element={<Orders />} />
        <Route path="bulk-shipping" element={<BulkShippingPage />} />

        {/* Products routes */}
        <Route path="products" element={<Products />} />
        <Route path="product/:productId" element={<ProductDetail />} />
        <Route path="product/add" element={<AddProduct />} />
        <Route path="product/edit/:productId" element={<EditProduct />} />
        
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default VendorRoutes;
