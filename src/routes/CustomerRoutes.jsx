import React, { useState, useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus } from "../redux/authSlice";
import CustomerLayout from "../layouts/CustomerLayout";
import Home from "../pages/Customer/Pages/Home";
import ProductListing from "../Pages/Customer/Pages/ProductListing";
import Login from "../Pages/Auth/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "../pages/Auth/Register";
import ProductDetails from "../Pages/Customer/Pages/ProductDetails";
import MyAccount from "../Pages/Customer/Pages/MyAccount";
import Dashboard from "../pages/Customer/Pages/MyAccount/Dashboard";
import Profile from "../Pages/Customer/Pages/MyAccount/Profile";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ProductZoom from "../components/customer/Components/ProductZoom";
import { IoCloseSharp } from "react-icons/io5";
import ProductDetailsComponent from "../components/customer/Components/ProductDetails";
import MyContext from "../context/MyContext";
import Cart from "../pages/Customer/Pages/Cart";
import SearchResults from "../components/customer/Components/Search/SearchResult";
import ResetPassword from "../pages/Auth/ResetPassword";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import OrdersList from "../components/customer/Components/MyOrders";
import AddressPage from "../pages/Customer/Pages/Address";
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
          {/* Bọc tất cả route con trong CustomerLayout */}
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<Home />} />

            <Route path="/search" element={<SearchResults />} />

            <Route path="/login" exact={true} element={<Login />} />
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
            <Route path="/cart" exact={true} element={<Cart />} />

            {/* Thêm routes cho My Account */}
            <Route path="/my-account" element={<MyAccount />}>
              {/* Thay Dashboard bằng trang khác bạn muốn, ví dụ Profile */}
              <Route index element={<Dashboard />} />
              <Route path="profile/:user_id" element={<Profile />} />
              {/* Thêm các routes con khác như Orders, Addresses nếu cần */}
              /* <Route path="orders" element={<OrdersList />} />
              <Route path="addresses" element={<AddressPage />} />
              {/* <Route path="wishlist" element={<Wishlist />} /> */}
            </Route>
          </Route>
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
