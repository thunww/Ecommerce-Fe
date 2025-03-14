import { Routes, Route } from "react-router-dom";
import CustomerLayout from "../layouts/CustomerLayout";
import Home from "../pages/Customer/Pages/Home";
import ProductListing from "../pages/Customer/Pages/ProductListing";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
const CustomerRoutes = () => {
    return (
        <Routes>
            {/* Bọc tất cả route con trong CustomerLayout */}
            <Route path="/" element={<CustomerLayout />}>
                <Route index element={<Home />} />
                <Route path="productListing" element={<ProductListing />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register/>}/>
            </Route>
        </Routes>
    );
};
export default CustomerRoutes;