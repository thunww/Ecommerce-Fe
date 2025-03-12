import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import BannerBoxV2 from '../BannerBoxV2';
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
                    <BannerBoxV2 info='left' image={'https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/sub-banner-1.jpg'} link={'/'} />
                </SwiperSlide>

                <SwiperSlide>
                    <BannerBoxV2 info='right' image={'https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/cms-banner-1.jpg'} link={'/'} />
                </SwiperSlide>

                <SwiperSlide>
                    <BannerBoxV2 info='left' image={'https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/sub-banner-1.jpg'} link={'/'} />
                </SwiperSlide>

                <SwiperSlide>
                    <BannerBoxV2 info='right' image={'https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/sub-banner-2.jpg'} link={'/'} />
                </SwiperSlide>

                <SwiperSlide>
                    <BannerBoxV2 info='left' image={'https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/sub-banner-1.jpg'} link={'/'} />
                </SwiperSlide>

                <SwiperSlide>
                    <BannerBoxV2 info='left' image={'https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/sub-banner-1.jpg'} link={'/'} />
                </SwiperSlide>
            </Swiper>

        </div>
    )
}

export default AdsbannerSlider;
