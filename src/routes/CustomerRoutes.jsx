import React, { useState, useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus } from "../redux/authSlice";
import CustomerLayout from "../layouts/CustomerLayout";
import Home from "../pages/Customer/Pages/Home";

import ProductListing from "../pages/Customer/Pages/ProductListing";


import Login from "../pages/Auth/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "../pages/Auth/Register";
import ProductDetails from "../pages/Customer/Pages/ProductDetails";
import MyAccount from "../pages/Customer/Pages/MyAccount";


import Dashboard from "../pages/Customer/Pages/MyAccount/Dashboard";
import Profile from "../pages/Customer/Pages/MyAccount/Profile";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import ProductZoom from "../components/customer/Components/ProductZoom";
import { IoCloseSharp } from "react-icons/io5";
import ProductDetailsComponent from "../components/customer/Components/ProductDetails";
import MyContext from "../context/MyContext";
import Cart from "../pages/Customer/Pages/Cart";
import SearchPage from "../components/customer/Components/Search/SearchPage";
import ResetPassword from "../pages/Auth/ResetPassword";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import Checkout from "../pages/Customer/Pages/Checkout";
import OrdersList from "../components/customer/Components/MyOrders";
import AddressList from "../pages/Customer/Pages/Address/AddressList";
import ShipperRegister from "../pages/Shipper/ShipperRegister";
import Payment from "../components/customer/Components/Payment";
import ShopPage from "../components/customer/Components/ShopPage/ShopDetail";
import VendorRegistration from "../components/seller/RegisterVendor/RegisterVendor";
import PrivateRoute from "./PrivateRoute";

const CustomerRoutes = () => {
  const dispatch = useDispatch();
  const [openProductDetailsModal, setOpenProductDetailsModal] = useState(false);
  const [maxWidth, setMaxWidth] = useState("lg");
  const [fullWidth, setFullWidth] = useState(true);
  const [openCartPanel, setOpenCartPanel] = useState(false);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi component mount
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const handleCloseProductDetailsModal = () => {
    setOpenProductDetailsModal(false);
  };

  const toggleCartPanel = (newOpen) => {
    setOpenCartPanel(newOpen);
  };

  const values = {
    setOpenProductDetailsModal,
    setOpenCartPanel,
    openCartPanel,
    toggleCartPanel,
  };

  return (
    <>
      <MyContext.Provider value={values}>
        <Routes>

          <Route element={<PrivateRoute allowedRoles={["customer"]} />}>
            <Route path="/register-vendor" element={<VendorRegistration />} />
          </Route>
          {/* Bọc tất cả route con trong CustomerLayout */}


          {/* <Route path="/register-vendor" element={<VendorRegistration />} />
          Bọc tất cả route con trong CustomerLayout */}


          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<Home />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="shop/:shopId" element={<ShopPage />} />
            <Route path="login" exact={true} element={<Login />} />
            <Route path="register" exact={true} element={<Register />} />
            <Route
              path="forgot-password"
              exact={true}
              element={<ForgotPassword />}
            />
            <Route
              path="reset-password"
              exact={true}
              element={<ResetPassword />}
            />
            <Route
              path="/product/:id"
              exact={true}
              element={<ProductDetails />}
            />
            <Route element={<PrivateRoute allowedRoles={["customer"]} />}>
              <Route path="/cart" exact={true} element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/my-account" element={<MyAccount />}>
                <Route index element={<Dashboard />} />
                <Route path="profile/:user_id" element={<Profile />} />
                <Route path="orders" element={<OrdersList />} />
                <Route path="addresses" element={<AddressList />} />
              </Route>
            </Route>
          </Route>
          {/* Đóng Routes trong MyContext.Provider */}
        </Routes>
      </MyContext.Provider>
      <ToastContainer />

      <Dialog
        open={openProductDetailsModal}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        onClose={handleCloseProductDetailsModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="productDetailsModal"
      >
        <DialogContent>
          <div className="flex items-center w-full productDetailsModalContainer relative">
            <Button
              className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] !absolute top-[15px] right-[15px] !bg-[#f1f1f1]"
              onClick={handleCloseProductDetailsModal}
            >
              <IoCloseSharp className="text-[20px]" />
            </Button>
            <div className="col1 w-[40%]">
              <ProductZoom />
            </div>
            <div className="col2 w-[60%] py-8 px-16 pr-16 productContent">
              <ProductDetailsComponent />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomerRoutes;