import React, { useState, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import CustomerLayout from "../layouts/CustomerLayout";
import Home from "../pages/Customer/Pages/Home";
import ProductListing from "../pages/Customer/Pages/ProductListing";
// import Login from "../pages/Auth/Login";

import Register from "../pages/Auth/Register";
import ProductDetails from "../pages/Customer/Pages/ProductDetails";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ProductZoom from "../components/customer/Components/ProductZoom";
import { IoCloseSharp } from "react-icons/io5";
import ProductDetailsComponent from "../components/customer/Components/ProductDetails";
// import Login from "../pages/Customer/Pages/Login";
import Login from "../pages/Auth/Login";
import MyContext from "../context/MyContext"; // ✅ Import từ file riêng
import CartPage from "../pages/Customer/Pages/Cart";




const CustomerRoutes = () => {

    const [openProductDetailsModal, setOpenProductDetailsModal] = useState(false);
    const [maxWidth, setMaxWidth] = useState('lg');
    const [fullWidth, setFullWidth] = useState(true);
    const [openCartPanel, setOpenCartPanel] = useState(false);


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
        toggleCartPanel
    }


    return (
        <>

            <MyContext.Provider value={values}>
                <Routes>
                    {/* Bọc tất cả route con trong CustomerLayout */}
                    <Route path="/" element={<CustomerLayout />}>
                        <Route index element={<Home />} />
                        <Route path="/productListing" exact={true} element={<ProductListing />} />
                        <Route path="/login" exact={true} element={<Login />} />
                        <Route path="register" exact={true} element={<Register />} />
                        <Route path="/product/:id" exact={true} element={<ProductDetails />} />
                        <Route path="/cart" exact={true} element={<CartPage />} />
                    </Route>
                </Routes>
            </MyContext.Provider>

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
                        <Button className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] !absolute top-[15px] right-[15px] !bg-[#f1f1f1]"
                            onClick={handleCloseProductDetailsModal}>
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
