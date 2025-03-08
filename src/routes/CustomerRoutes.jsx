import { Routes, Route } from "react-router-dom";
import CustomerLayout from "../layouts/CustomerLayout";
import Home from "../pages/Customer/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
const CustomerRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<CustomerLayout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
            </Route>
        </Routes>
    );
};

export default CustomerRoutes;
