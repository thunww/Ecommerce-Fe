import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

const AdsbannerSlider = (props) => {
    return (
        <div className='adsbannerSlider py-3 sm:py-5 w-full'>
            <Swiper
                slidesPerView={1}
                spaceBetween={10}
                navigation={true}
                modules={[Navigation]}
                className='smlBtn'
                breakpoints={{
                    480: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 10,
                    },
                    1024: {
                        slidesPerView: props.items || 4,
                        spaceBetween: 10,
                    },
                }}
            >
                <SwiperSlide>
                    <div className='item relative rounded-md overflow-hidden group'>
                        <img src='https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/cms-banner-1.jpg'
                            className='w-full transition-all duration-700 group-hover:scale-110' />
                        <div className='info absolute top-0 left-0 w-full h-full z-10 p-5 flex items-start flex-col justify-center'>
                            <h4 className='text-[16px] sm:text-[18px] font-[500] text-left w-full mb-2 sm:mb-3'>
                                Big Saving Days Sale
                            </h4>
                            <h2 className='text-[20px] sm:text-[28px] md:text-[35px] leading-tight font-[700] w-full max-w-[250px]'>
                                Women Solid Round Neck T-Shirt
                            </h2>
                            <h2 className='text-[16px] sm:text-[20px] font-[500] w-full mb-2 sm:mb-4 mt-2'>
                                From $49.90
                            </h2>
                            <button className='bg-black hover:bg-blue-700 text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-sm'>
                                Shop Now
                            </button>
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className='item relative rounded-md overflow-hidden group'>
                        <img src='https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/cms-banner-2.jpg'
                            className='w-full transition-all duration-700 group-hover:scale-110' />
                        <div className='info absolute top-0 left-0 w-full h-full z-10 p-5 flex items-start flex-col justify-center'>
                            <h4 className='text-[16px] sm:text-[18px] font-[500] text-left w-full mb-2 sm:mb-3'>
                                End of Season Sale
                            </h4>
                            <h2 className='text-[20px] sm:text-[28px] md:text-[35px] leading-tight font-[700] w-full max-w-[250px]'>
                                Smartphone Brand New Models
                            </h2>
                            <h2 className='text-[16px] sm:text-[20px] font-[500] w-full mb-2 sm:mb-4 mt-2'>
                                From $199.90
                            </h2>
                            <button className='bg-black hover:bg-blue-700 text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-sm'>
                                Shop Now
                            </button>
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className='item relative rounded-md overflow-hidden group'>
                        <img src='https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/cms-banner-1.jpg'
                            className='w-full transition-all duration-700 group-hover:scale-110' />
                        <div className='info absolute top-0 left-0 w-full h-full z-10 p-5 flex items-start flex-col justify-center'>
                            <h4 className='text-[16px] sm:text-[18px] font-[500] text-left w-full mb-2 sm:mb-3'>
                                Weekly Featured Products
                            </h4>
                            <h2 className='text-[20px] sm:text-[28px] md:text-[35px] leading-tight font-[700] w-full max-w-[250px]'>
                                High Quality Headphones
                            </h2>
                            <h2 className='text-[16px] sm:text-[20px] font-[500] w-full mb-2 sm:mb-4 mt-2'>
                                From $29.90
                            </h2>
                            <button className='bg-black hover:bg-blue-700 text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-sm'>
                                Shop Now
                            </button>
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className='item relative rounded-md overflow-hidden group'>
                        <img src='https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/cms-banner-2.jpg'
                            className='w-full transition-all duration-700 group-hover:scale-110' />
                        <div className='info absolute top-0 left-0 w-full h-full z-10 p-5 flex items-start flex-col justify-center'>
                            <h4 className='text-[16px] sm:text-[18px] font-[500] text-left w-full mb-2 sm:mb-3'>
                                Special Collection
                            </h4>
                            <h2 className='text-[20px] sm:text-[28px] md:text-[35px] leading-tight font-[700] w-full max-w-[250px]'>
                                Trendy Fashion Accessories
                            </h2>
                            <h2 className='text-[16px] sm:text-[20px] font-[500] w-full mb-2 sm:mb-4 mt-2'>
                                From $19.90
                            </h2>
                            <button className='bg-black hover:bg-blue-700 text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-sm'>
                                Shop Now
                            </button>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    )
}

export default AdsbannerSlider;
