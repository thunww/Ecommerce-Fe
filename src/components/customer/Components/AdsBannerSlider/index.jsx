import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import BannerBox from '../BannerBox';
const AdsbannerSlider = (props) => {
    return (
        <div className='py-5 w-full'>

            <Swiper
                slidesPerView={props.items}
                spaceBetween={10}
                navigation={true}
                modules={[Navigation]}
                className='smlBtn'

            >
                <SwiperSlide>
                    <BannerBox img={'/banner1.jpg'} link={'/'} />
                </SwiperSlide>

                <SwiperSlide>
                    <BannerBox img={'/banner8.jpg'} link={'/'} />
                </SwiperSlide>

                <SwiperSlide>
                    <BannerBox img={'/banner1.jpg'} link={'/'} />
                </SwiperSlide>

                <SwiperSlide>
                    <BannerBox img={'/banner8.jpg'} link={'/'} />
                </SwiperSlide>

                <SwiperSlide>
                    <BannerBox img={'/banner1.jpg'} link={'/'} />
                </SwiperSlide>

                <SwiperSlide>
                    <BannerBox img={'/banner1.jpg'} link={'/'} />
                </SwiperSlide>
            </Swiper>

        </div>
    )
}

export default AdsbannerSlider;
