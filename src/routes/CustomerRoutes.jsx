import { Routes, Route } from "react-router-dom";
// import CustomerLayout from "../layouts/CustomerLayout";
import Home from "../pages/Customer/Pages/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Header from "../components/customer/Components/Header";
const CustomerRoutes = () => {
    return (
        <>
            <Header />

            <Routes>
                <Route path="/" element={<Home />} />
                {/* <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> */}
            </Routes>
        </>
    );
};

export default CustomerRoutes;
