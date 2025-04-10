import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

const HomeCatSlider = () => {
  return (
    <div className="homeCatSlider pt-3 sm:pt-4 py-1">
      <div className="container px-4 sm:px-6 overflow-hidden">
        <Swiper
          slidesPerView={3}
          spaceBetween={10}
          navigation={true}
          modules={[Navigation]}
          className="mySwiper"
          breakpoints={{
            480: {
              slidesPerView: 4,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 5,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 6,
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 7,
              spaceBetween: 10,
            },
            1280: {
              slidesPerView: 8,
              spaceBetween: 10,
            },
          }}
        >
          <SwiperSlide className="">
            <Link to="/">
              <div className="item py-3 sm:py-5 px-2 bg-white rounded-sm text-center flex items-center justify-center flex-col">
                <img
                  src="https://down-vn.img.susercontent.com/file/687f3967b7c2fe6a134a2c11894eea4b@resize_w640_nl.webp"
                  className="w-[40px] sm:w-[60px] transition-all"
                />
                <h3 className="text-[13px] sm:text-[15px] font-[500] mt-2 sm:mt-3 truncate">
                  Fashion
                </h3>
              </div>
            </Link>
          </SwiperSlide>

          <SwiperSlide className="">
            <Link to="/">
              <div className="item py-3 sm:py-5 px-2 bg-white rounded-sm text-center flex items-center justify-center flex-col">
                <img
                  src="https://down-vn.img.susercontent.com/file/86c294aae72ca1db5f541790f7796260@resize_w640_nl.webp"
                  className="w-[40px] sm:w-[60px] transition-all"
                />
                <h3 className="text-[13px] sm:text-[15px] font-[500] mt-2 sm:mt-3 truncate">
                  Watch
                </h3>
              </div>
            </Link>
          </SwiperSlide>

          <SwiperSlide className="">
            <Link to="/">
              <div className="item py-3 sm:py-5 px-2 bg-white rounded-sm text-center flex items-center justify-center flex-col">
                <img
                  src="https://down-vn.img.susercontent.com/file/978b9e4cb61c611aaaf58664fae133c5@resize_w640_nl.webp"
                  className="w-[40px] sm:w-[60px] transition-all"
                />
                <h3 className="text-[13px] sm:text-[15px] font-[500] mt-2 sm:mt-3 truncate">
                  Electronics
                </h3>
              </div>
            </Link>
          </SwiperSlide>

          <SwiperSlide className="">
            <Link to="/">
              <div className="item py-3 sm:py-5 px-2 bg-white rounded-sm text-center flex items-center justify-center flex-col">
                <img
                  src="https://down-vn.img.susercontent.com/file/74ca517e1fa74dc4d974e5d03c3139de@resize_w640_nl.webp"
                  className="w-[40px] sm:w-[60px] transition-all"
                />
                <h3 className="text-[13px] sm:text-[15px] font-[500] mt-2 sm:mt-3 truncate">
                  Footwear
                </h3>
              </div>
            </Link>
          </SwiperSlide>

          <SwiperSlide className="">
            <Link to="/">
              <div className="item py-3 sm:py-5 px-2 bg-white rounded-sm text-center flex items-center justify-center flex-col">
                <img
                  src="https://down-vn.img.susercontent.com/file/ef1f336ecc6f97b790d5aae9916dcb72@resize_w640_nl.webp"
                  className="w-[40px] sm:w-[60px] transition-all"
                />
                <h3 className="text-[13px] sm:text-[15px] font-[500] mt-2 sm:mt-3 truncate">
                  Beauty Products
                </h3>
              </div>
            </Link>
          </SwiperSlide>

          <SwiperSlide className="">
            <Link to="/">
              <div className="item py-3 sm:py-5 px-2 bg-white rounded-sm text-center flex items-center justify-center flex-col">
                <img
                  src="https://down-vn.img.susercontent.com/file/fa6ada2555e8e51f369718bbc92ccc52@resize_w640_nl.webp"
                  className="w-[40px] sm:w-[60px] transition-all"
                />
                <h3 className="text-[13px] sm:text-[15px] font-[500] mt-2 sm:mt-3 truncate">
                  Bags
                </h3>
              </div>
            </Link>
          </SwiperSlide>

          <SwiperSlide className="">
            <Link to="/">
              <div className="item py-3 sm:py-5 px-2 bg-white rounded-sm text-center flex items-center justify-center flex-col">
                <img
                  src="https://down-vn.img.susercontent.com/file/8e71245b9659ea72c1b4e737be5cf42e@resize_w640_nl.webp"
                  className="w-[40px] sm:w-[60px] transition-all"
                />
                <h3 className="text-[13px] sm:text-[15px] font-[500] mt-2 sm:mt-3 truncate">
                  Accessories
                </h3>
              </div>
            </Link>
          </SwiperSlide>

          <SwiperSlide className="">
            <Link to="/">
              <div className="item py-3 sm:py-5 px-2 bg-white rounded-sm text-center flex items-center justify-center flex-col">
                <img
                  src="https://down-vn.img.susercontent.com/file/31234a27876fb89cd522d7e3db1ba5ca@resize_w640_nl.webp"
                  className="w-[40px] sm:w-[60px] transition-all"
                />
                <h3 className="text-[13px] sm:text-[15px] font-[500] mt-2 sm:mt-3 truncate">
                  Smartphones
                </h3>
              </div>
            </Link>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default HomeCatSlider;
