import React from "react";
import HomeSlider from "../../../../components/customer/Components/HomeSlider";
import HomeCatSlider from "../../../../components/customer/Components/HomeCatSlider";
import { FaShippingFast } from "react-icons/fa";
import AdsbannerSlider from "../../../../components/customer/Components/AdsBannerSlider";
import AdsbannerSliderV2 from "../../../../components/customer/Components/AdsBannerSliderV2";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ProductsSlider from "../../../../components/customer/Components/ProductsSlider";
import { Link } from "react-router-dom";
import Footer from "../../../../components/customer/Components/Footer";
import HomeBannerV2 from "../../../../components/customer/Components/HomeSliderV2";
import BannerBoxV2 from "../../../../components/customer/Components/BannerBoxV2";
import Header from "../../../../components/customer/Components/Header";

const Home = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Header />
            <HomeSlider />
            <section className="py-6">
                <div className="container flex  gap-5">
                    <div className="part1 w-[70%]">
                        <HomeBannerV2 />
                    </div>

                    <div className="part2 w-[30%] flex items-center gap-5 justify-between flex-col">
                        <BannerBoxV2 info='left' image={'https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/sub-banner-1.jpg'} />
                        <BannerBoxV2 info='right' image={'https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/sub-banner-2.jpg'} />
                    </div>
                </div>
            </section>
            <HomeCatSlider />

            <section className="bg-white py-8">
                <div className="container">
                    <div className="flex place-items-center justify-between">
                        <div className="leftSec">
                            <h2 className="text-[22px] font-[600]">
                                Popular ProDuct
                            </h2>
                            <p className="text-[14px] font-[500]">
                                Do not mis the current offers until the end of March</p>
                        </div>
                        <div className="rightSec w-[70%]">
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                aria-label="scrollable auto tabs example"
                            >
                                <Tab label="Fashion" />
                                <Tab label="Electronics" />
                                <Tab label="Bags" />
                                <Tab label="Beauty" />
                                <Tab label="Wealness" />
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

                    <ProductsSlider items={6} />


                </div>
            </section>

            <section className="py-4 pt-2 bg-white">
                <div className="container">
                    <div className="freeShipping w-full py-4 p-4 border-2 border-[red] flex items-center justify-between rounded-md mb-2">
                        <div className="col1 flex items-center gap-4">
                            <FaShippingFast className="text-[40px] font-[600]" />
                            <span className="text-[20px] font-[600] uppercase">FreeShipping</span>
                        </div>

                        <div className="col2">
                            <p className="text-[15px] mb-0 font-[500]">Free Delivery Now On Your First Order and over $200</p>
                        </div>
                        <p className="font-bold text-[25px]">Only $200*</p>
                    </div>




                    <AdsbannerSliderV2 items={4} />
                </div>

            </section>

            <section className="py-5 pt-0">
                <div className="container">
                    <h2 className="text-[22px] font-[600]">
                        Latest Products
                    </h2>
                    <ProductsSlider items={6} />

                    <AdsbannerSlider items={4} />
                </div>
            </section>

            <Footer />

        </>
    );
}

export default Home;
