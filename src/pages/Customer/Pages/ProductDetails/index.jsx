import React, { useState } from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import ProductZoom from '../../../../components/customer/Components/ProductZoom';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';



import TextField from '@mui/material/TextField';
import ProductsSlider from '../../../../components/customer/Components/ProductsSlider';
import ProductDetailsComponent from '../../../../components/customer/Components/ProductDetails';
const ProductDetails = () => {

    const [activeTab, setActiveTab] = useState(0);
    return (
        <>
            <div className='py-5 '>
                <div className='container'>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            underline="hover"
                            color="inherit"
                            to="/"
                            className='link transition !text-[14px]'>
                            Home
                        </Link>
                        <Link
                            underline="hover"
                            color="inherit"
                            to="/"
                            className='link transition !text-[14px]'
                        >
                            Fashion
                        </Link>
                        <Link
                            underline="hover"
                            color="inherit"
                            to="/"
                            className='link transition !text-[14px]'
                        >
                            Ten San Pham 1
                        </Link>
                    </Breadcrumbs>
                </div>


            </div>

            <section className='bg-white py-5'>
                <div className='container flex gap-8 '>
                    <div className='productZoomContainer w-[40%]'>
                        <ProductZoom />
                    </div>

                    <div className='productContent w-[60%] pr-10 pl-10'>
                        <ProductDetailsComponent />
                    </div>
                </div>

                <div className='container pt-10'>
                    <div className='flex items-center gap-8 mb-5'>
                        <span className={`'link text-[17px] cursor-pointer font-[500]' ${activeTab === 0 && 'text-red-500'}`}
                            onClick={() => setActiveTab(0)}>
                            Description
                        </span>
                        <span className={`'link text-[17px] cursor-pointer font-[500]' ${activeTab === 1 && 'text-red-500'}`}
                            onClick={() => setActiveTab(1)}>
                            ProductDetails
                        </span>
                        <span className={`'link text-[17px] cursor-pointer font-[500]' ${activeTab === 2 && 'text-red-500'}`}
                            onClick={() => setActiveTab(2)}>
                            Reviews (5)
                        </span>
                    </div>

                    {
                        activeTab === 0 && (<div className='shadow-md w-full py-5 px-8 rounded-md'>
                            <p>
                                Mieu ta san pham mot cach tho mong nhat
                            </p>
                            <h4>
                                Design
                            </h4>
                            <p>
                                Mo ta phong cach thiet ke sang trong thoi thuong ....
                            </p>
                            <h4>
                                Money Back Guarantee
                            </h4>
                            <p>
                                we offer 30 days money back guarantee
                            </p>
                            <h4>
                                Online support
                            </h4>
                            <p>
                                You will get 24/7 online support with this purchase product and you can return it within 30 days for an exchange.
                            </p>

                        </div>
                        )}

                    {
                        activeTab === 1 && (
                            <div className='shadow-md w-full py-5 px-8 rounded-md'>
                                <div class="relative overflow-x-auto">
                                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" class="px-6 py-3">
                                                    Thong tin 1
                                                </th>
                                                <th scope="col" class="px-6 py-3">
                                                    Thong Tin 2
                                                </th>
                                                <th scope="col" class="px-6 py-3">
                                                    Thong Tin 3
                                                </th>
                                                <th scope="col" class="px-6 py-3">
                                                    Thong Tin 4
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                                <td class="px-6 py-4 font-[500]">
                                                    Chi tiet Thong tin 1
                                                </td>
                                                <td class="px-6 py-4 font-[500]">
                                                    Chi tiet thong tin 2
                                                </td>
                                                <td class="px-6 py-4 font-[500]">
                                                    Chi tiet thong tin 3
                                                </td>
                                                <td class="px-6 py-4 font-[500]">
                                                    Chi tiet thong tin 4
                                                </td>
                                            </tr>

                                            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                                <td class="px-6 py-4 font-[500]">
                                                    Chi tiet Thong tin 1
                                                </td>
                                                <td class="px-6 py-4 font-[500]">
                                                    Chi tiet thong tin 2
                                                </td>
                                                <td class="px-6 py-4 font-[500]">
                                                    Chi tiet thong tin 3
                                                </td>
                                                <td class="px-6 py-4 font-[500]">
                                                    Chi tiet thong tin 4
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                    {
                        activeTab === 2 && (
                            <div className='shadow-md w-[80%] py-5 px-8 rounded-md'>
                                <div className='w-full productReviewsContainer'>
                                    <h2 className='text-[18px]'>
                                        Customer questions & answers
                                    </h2>
                                    <div className='reviewScroll w-full max-h-[300px] overflow-y-scroll overflow-x-hidden mt-5 pr-5'>
                                        <div className='review  pt-5 pb-5 border-b border-[rgba(0,0,0,0.1)] w-full flex items-center justify-between'>
                                            <div className='info w-[60%] flex items-center gap-3'>
                                                <div className='img w-[80px] h-[80px] overflow-hidden rounded-full'>
                                                    <img src="https://www.amity.edu/gurugram/microbackoffice/Uploads/TestimonialImage/98testi_RajivBasavaalumni.jpg"
                                                        className="w-[full]" />
                                                </div>

                                                <div className='w-[80%]'>
                                                    <h4 className='text-[16px]'>Ten User 1</h4>
                                                    <h5 className='text-[13px] mb-0'>2025-03-17</h5>
                                                    <p className='mt-0 mb-0'>Nice ProDuct hahahhahassssssssssssssssssssssssssssssssssssssssssss</p>

                                                </div>
                                            </div>
                                            <Rating
                                                name="size-small"
                                                defaultValue={4}
                                                readOnly />
                                        </div>
                                        <div className='review  pt-5 pb-5 border-b border-[rgba(0,0,0,0.1)] w-full flex items-center justify-between'>
                                            <div className='info w-[60%] flex items-center gap-3'>
                                                <div className='img w-[80px] h-[80px] overflow-hidden rounded-full'>
                                                    <img src="https://www.amity.edu/gurugram/microbackoffice/Uploads/TestimonialImage/98testi_RajivBasavaalumni.jpg"
                                                        className="w-[full]" />
                                                </div>

                                                <div className='w-[80%]'>
                                                    <h4 className='text-[16px]'>Ten User 1</h4>
                                                    <h5 className='text-[13px] mb-0'>2025-03-17</h5>
                                                    <p className='mt-0 mb-0'>Nice ProDuct hahahhahassssssssssssssssssssssssssssssssssssssssssss</p>

                                                </div>
                                            </div>
                                            <Rating
                                                name="size-small"
                                                defaultValue={4}
                                                readOnly />
                                        </div>
                                        <div className='review  pt-5 pb-5 border-b border-[rgba(0,0,0,0.1)] w-full flex items-center justify-between'>
                                            <div className='info w-[60%] flex items-center gap-3'>
                                                <div className='img w-[80px] h-[80px] overflow-hidden rounded-full'>
                                                    <img src="https://www.amity.edu/gurugram/microbackoffice/Uploads/TestimonialImage/98testi_RajivBasavaalumni.jpg"
                                                        className="w-[full]" />
                                                </div>

                                                <div className='w-[80%]'>
                                                    <h4 className='text-[16px]'>Ten User 1</h4>
                                                    <h5 className='text-[13px] mb-0'>2025-03-17</h5>
                                                    <p className='mt-0 mb-0'>Nice ProDuct hahahhahassssssssssssssssssssssssssssssssssssssssssss</p>

                                                </div>
                                            </div>
                                            <Rating
                                                name="size-small"
                                                defaultValue={4}
                                                readOnly />
                                        </div>
                                        <div className='review  pt-5 pb-5 border-b border-[rgba(0,0,0,0.1)] w-full flex items-center justify-between'>
                                            <div className='info w-[60%] flex items-center gap-3'>
                                                <div className='img w-[80px] h-[80px] overflow-hidden rounded-full'>
                                                    <img src="https://www.amity.edu/gurugram/microbackoffice/Uploads/TestimonialImage/98testi_RajivBasavaalumni.jpg"
                                                        className="w-[full]" />
                                                </div>

                                                <div className='w-[80%]'>
                                                    <h4 className='text-[16px]'>Ten User 1</h4>
                                                    <h5 className='text-[13px] mb-0'>2025-03-17</h5>
                                                    <p className='mt-0 mb-0'>Nice ProDuct hahahhahassssssssssssssssssssssssssssssssssssssssssss</p>

                                                </div>
                                            </div>
                                            <Rating
                                                name="size-small"
                                                defaultValue={4}
                                                readOnly />
                                        </div>
                                        <div className='review  pt-5 pb-5 border-b border-[rgba(0,0,0,0.1)] w-full flex items-center justify-between'>
                                            <div className='info w-[60%] flex items-center gap-3'>
                                                <div className='img w-[80px] h-[80px] overflow-hidden rounded-full'>
                                                    <img src="https://www.amity.edu/gurugram/microbackoffice/Uploads/TestimonialImage/98testi_RajivBasavaalumni.jpg"
                                                        className="w-[full]" />
                                                </div>

                                                <div className='w-[80%]'>
                                                    <h4 className='text-[16px]'>Ten User 1</h4>
                                                    <h5 className='text-[13px] mb-0'>2025-03-17</h5>
                                                    <p className='mt-0 mb-0'>Nice ProDuct hahahhahassssssssssssssssssssssssssssssssssssssssssss</p>

                                                </div>
                                            </div>
                                            <Rating
                                                name="size-small"
                                                defaultValue={4}
                                                readOnly />
                                        </div>


                                    </div>


                                    <br />


                                    <div className='reviewForm bg-[#f1f1f1] p-4 rounded-md'>
                                        <h2 className='text-[18px]'>Add a review</h2>

                                        <form className='w-full'>
                                            <TextField
                                                id="outlined-multiline-flexible"
                                                label="Write a review..."
                                                className='w-full mb-5'
                                                multiline
                                                rows={5}
                                            />
                                            <br /> <br />
                                            <Rating
                                                name="size-small"
                                                defaultValue={4}
                                            />

                                            <div className='flex items-center mt-5'>
                                                <Button className='btn-org'>Submit Review</Button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )
                    }


                </div>

                <div className='container pt-8'>
                    <h2 className="text-[22px] font-[600] pb-0">
                        Related Products
                    </h2>
                    <ProductsSlider items={6} />
                </div>
            </section>
        </>
    )
}

export default ProductDetails;
