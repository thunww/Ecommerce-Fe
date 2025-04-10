import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation, Autoplay } from "swiper/modules";
const HomeSlider = () => {
  return (
    <div className="homeSlider py-3 sm:py-4">
      <div className="container px-4 sm:px-6 overflow-hidden">
        <Swiper
          spaceBetween={10}
          navigation={true}
          loop={true}
          modules={[Navigation, Autoplay]}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          className="sliderHome"
        >
          <SwiperSlide>
            <div className="item rounded-[10px] sm:rounded-[20px] overflow-hidden">
              <img
                src="https://cf.shopee.vn/file/vn-11134258-7ra0g-m6zggds6byxt8d_xxhdpi"
                alt="Banner slide"
                className="w-full"
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item rounded-[10px] sm:rounded-[20px] overflow-hidden">
              <img
                src="https://cf.shopee.vn/file/vn-11134258-7ra0g-m6zg8u93ojlk86_xxhdpi"
                alt="Banner slide"
                className="w-full"
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item rounded-[10px] sm:rounded-[20px] overflow-hidden">
              <img
                src="https://cf.shopee.vn/file/vn-11134258-7ra0g-m6z9ddjohsu056_xxhdpi"
                alt="Banner slide"
                className="w-full"
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item rounded-[20px] overflow-hidden">
              <img
                src="https://cf.shopee.vn/file/vn-11134258-7ra0g-m6zggds6byxt8d_xxhdpi"
                alt="Banner slide"
                className="w-full"
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item rounded-[20px] overflow-hidden">
              <img
                src="https://cf.shopee.vn/file/vn-11134258-7ra0g-m6zggds6byxt8d_xxhdpi"
                alt="Banner slide"
                className="w-full"
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item rounded-[20px] overflow-hidden">
              <img
                src="https://cf.shopee.vn/file/vn-11134258-7ra0g-m6zggds6byxt8d_xxhdpi"
                alt="Banner slide"
                className="w-full"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default HomeSlider;
