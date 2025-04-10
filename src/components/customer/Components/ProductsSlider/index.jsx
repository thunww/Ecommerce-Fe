import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import ProductItem from '../ProductItem';
import { useEffect, useState } from 'react';

const ProductsSlider = (props) => {
    return (
        <div className='productsSlider py-2'>
            <Swiper
                slidesPerView={1}
                spaceBetween={10}
                navigation={true}
                modules={[Navigation]}
                className='mySwiper'
                breakpoints={{
                    480: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                    640: {
                        slidesPerView: 3,
                        spaceBetween: 10,
                    },
                    768: {
                        slidesPerView: 4,
                        spaceBetween: 10,
                    },
                    1024: {
                        slidesPerView: 5,
                        spaceBetween: 10,
                    },
                    1280: {
                        slidesPerView: props.items || 6,
                        spaceBetween: 10,
                    },
                }}
            >
                <SwiperSlide>
                    <ProductItem />
                </SwiperSlide>

                <SwiperSlide>
                    <ProductItem />
                </SwiperSlide>

                <SwiperSlide>
                    <ProductItem />
                </SwiperSlide>

                <SwiperSlide>
                    <ProductItem />
                </SwiperSlide>

                <SwiperSlide>
                    <ProductItem />
                </SwiperSlide>

                <SwiperSlide>
                    <ProductItem />
                </SwiperSlide>

                <SwiperSlide>
                    <ProductItem />
                </SwiperSlide>
            </Swiper>
        </div>
    )
}

export default ProductsSlider
