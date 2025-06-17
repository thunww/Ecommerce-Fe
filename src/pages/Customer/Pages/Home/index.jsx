import React, { useEffect } from "react";
import HomeSlider from "../../../../components/customer/Components/HomeSlider";
import HomeCatSlider from "../../../../components/customer/Components/HomeCatSlider";
import { FaShippingFast } from "react-icons/fa";
import AdsbannerSlider from "../../../../components/customer/Components/AdsBannerSlider";
import AdsbannerSliderV2 from "../../../../components/customer/Components/AdsBannerSliderV2";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ProductsSlider from "../../../../components/customer/Components/ProductsSlider";
import { Link } from "react-router-dom";
import Footer from "../../../../components/customer/Components/Footer";
import HomeBannerV2 from "../../../../components/customer/Components/HomeSliderV2";
import BannerBoxV2 from "../../../../components/customer/Components/bannerBoxV2"
import Header from "../../../../components/customer/Components/Header";
import { fetchUserById } from "../../../../redux/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../../../../redux/productSilce";
import ProductItem from "../../../../components/customer/Components/ProductItem";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Home = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = React.useState(1);
  const productsPerPage = 24;
  const {
    products = [],
    loading,
    error,
  } = useSelector((state) => state.products);
  const activeProducts = Array.isArray(products)
    ? products.filter((product) => product.status === "active")
    : [];

  const totalPages = Math.ceil(activeProducts.length / productsPerPage);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = activeProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const userId = useSelector((state) => state.auth.user?.user_id);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, products.length]);
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
    }
  }, [dispatch, userId]);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <HomeSlider />

      <section className="py-4 sm:py-6">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-5">
            <div className="part1 w-full md:w-[70%]">
              <HomeBannerV2 />
            </div>

            <div className="part2 w-full md:w-[30%] flex flex-row md:flex-col items-center gap-4 md:gap-5 justify-between">
              <div className="w-1/2 md:w-full">
                <BannerBoxV2
                  info="left"
                  image={
                    "https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/sub-banner-1.jpg"
                  }
                />
              </div>
              <div className="w-1/2 md:w-full">
                <BannerBoxV2
                  info="right"
                  image={
                    "https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/sub-banner-2.jpg"
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <HomeCatSlider />

      <section className="py-4 sm:py-5 pt-0">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6">
            {/* Left Section: Title + Description */}
            <div className="leftSec w-full lg:w-auto">
              <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-semibold">
                Popular Products
              </h2>
              <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-600">
                Do not miss the current offers until the end of March
              </p>
            </div>

            {/* Right Section: Tabs */}
            <div className="rightSec w-full lg:flex-1 overflow-x-auto max-w-full">
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
                sx={{
                  minHeight: "42px",
                  "& .MuiTab-root": {
                    fontSize: { xs: "12px", sm: "14px" },
                    minHeight: "42px",
                    padding: { xs: "6px 10px", sm: "8px 16px" },
                    textTransform: "none",
                    fontWeight: 500,
                  },
                }}
              >
                <Tab label="Fashion" />
                <Tab label="Electronics" />
                <Tab label="Bags" />
                <Tab label="Beauty" />
                <Tab label="Wellness" />
                <Tab label="Item Six" />
                <Tab label="Item Seven" />
                <Tab label="Item One" />
                <Tab label="Item Two" />
                <Tab label="Item Three" />
                <Tab label="Item Four" />
                <Tab label="Item Five" />
                <Tab label="Item Six" />
                <Tab label="Item Seven" />
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      <section className="py-4 sm:py-5 pt-0">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="freeShipping w-full py-3 sm:py-4 px-3 sm:px-4 border-2 border-[red] flex flex-col sm:flex-row items-center gap-3 sm:gap-0 sm:justify-between rounded-md mb-2">
            <div className="col1 flex items-center gap-2 sm:gap-4">
              <FaShippingFast className="text-[30px] sm:text-[40px] font-[600] flex-shrink-0" />
              <span className="text-[16px] sm:text-[20px] font-[600] uppercase">
                FreeShipping
              </span>
            </div>

            <div className="col2 text-center sm:text-left">
              <p className="text-[13px] sm:text-[15px] mb-0 font-[500]">
                Free Delivery Now On Your First Order and over $200
              </p>
            </div>
            <p className="font-bold text-[18px] sm:text-[25px]">Only $200*</p>
          </div>

          <div className="mt-4 sm:mt-6">
            <AdsbannerSliderV2 items={4} />
          </div>
        </div>
      </section>

      <section className="py-4 sm:py-5 pt-0">
        <div className="container px-4 sm:px-6">
          <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-[600] mb-4">
            Today's Suggestion
          </h2>
          <div className="product-list grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
            {currentProducts.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </div>
          <div className="flex justify-center mt-8 gap-2 flex-wrap">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center border rounded-full text-gray-600 hover:bg-gray-200 disabled:opacity-40"
            >
              <FaArrowLeft />
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`w-9 h-9 flex items-center justify-center rounded-full border ${currentPage === index + 1
                  ? "bg-blue-500 text-white font-bold"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-9 h-9 flex items-center justify-center border rounded-full text-gray-600 hover:bg-gray-200 disabled:opacity-40"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
