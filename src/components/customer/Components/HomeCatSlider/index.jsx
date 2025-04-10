import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

const HomeCatSlider = () => {
  return (
    <div className='homeCatSlider pt-4 py-1'>
      <div className='container'>
        <Swiper
          slidesPerView={3}
          spaceBetween={10}
          navigation={true}
          modules={[Navigation]}
          className='mySwiper'
        >
          <SwiperSlide
            className=''>
            <Link to='/'>
              <div className='item py-5 px-2 bg-white rounded-sm text-center flex items-center justify-center flex-col'>
                <img
                  src='https://down-vn.img.susercontent.com/file/86c294aae72ca1db5f541790f7796260@resize_w640_nl.webp'
                  className='w-[60px] transition-all'
                />
                <h3 className='text-[15px] font-[500] mt-3'>Watch</h3>
              </div>
            </Link>
          </SwiperSlide>

          <SwiperSlide
            className=''>
            <Link to='/'>
              <div className='item py-5 px-2 bg-white rounded-sm text-center flex items-center justify-center flex-col'>
                <img
                  src='https://down-vn.img.susercontent.com/file/86c294aae72ca1db5f541790f7796260@resize_w640_nl.webp'
                  className='w-[60px] transition-all'
                />
                <h3 className='text-[15px] font-[500] mt-3'>Watch</h3>
              </div>
            </Link>
          </SwiperSlide>

          <SwiperSlide
            className=''>
            <Link to='/'>
              <div className='item py-5 px-2 bg-white rounded-sm text-center flex items-center justify-center flex-col'>
                <img
                  src='https://down-vn.img.susercontent.com/file/86c294aae72ca1db5f541790f7796260@resize_w640_nl.webp'
                  className='w-[60px] transition-all'
                />
                <h3 className='text-[15px] font-[500] mt-3'>Watch</h3>
              </div>
            </Link>
          </SwiperSlide>

          <SwiperSlide
            className=''>
            <Link to='/'>
              <div className='item py-5 px-2 bg-white rounded-sm text-center flex items-center justify-center flex-col'>
                <img
                  src='https://down-vn.img.susercontent.com/file/86c294aae72ca1db5f541790f7796260@resize_w640_nl.webp'
                  className='w-[60px] transition-all'
                />
                <h3 className='text-[15px] font-[500] mt-3'>Watch</h3>
              </div>
            </Link>
          </SwiperSlide>

          <SwiperSlide
            className=''>
            <Link to='/'>
              <div className='item py-5 px-2 bg-white rounded-sm text-center flex items-center justify-center flex-col'>
                <img
                  src='https://down-vn.img.susercontent.com/file/86c294aae72ca1db5f541790f7796260@resize_w640_nl.webp'
                  className='w-[60px] transition-all'
                />
                <h3 className='text-[15px] font-[500] mt-3'>Watch</h3>
              </div>
            </Link>
          </SwiperSlide>

          <SwiperSlide
            className=''>
            <Link to='/'>
              <div className='item py-5 px-2 bg-white rounded-sm text-center flex items-center justify-center flex-col'>
                <img
                  src='https://down-vn.img.susercontent.com/file/86c294aae72ca1db5f541790f7796260@resize_w640_nl.webp'
                  className='w-[60px] transition-all'
                />
                <h3 className='text-[15px] font-[500] mt-3'>Watch</h3>
              </div>
            </Link>
          </SwiperSlide>

          <SwiperSlide
            className=''>
            <Link to='/'>
              <div className='item py-5 px-2 bg-white rounded-sm text-center flex items-center justify-center flex-col'>
                <img
                  src='https://down-vn.img.susercontent.com/file/86c294aae72ca1db5f541790f7796260@resize_w640_nl.webp'
                  className='w-[60px] transition-all'
                />
                <h3 className='text-[15px] font-[500] mt-3'>Watch</h3>
              </div>
            </Link>
          </SwiperSlide>

          <SwiperSlide
            className=''>
            <Link to='/'>
              <div className='item py-5 px-2 bg-white rounded-sm text-center flex items-center justify-center flex-col'>
                <img
                  src='https://down-vn.img.susercontent.com/file/86c294aae72ca1db5f541790f7796260@resize_w640_nl.webp'
                  className='w-[60px] transition-all'
                />
                <h3 className='text-[15px] font-[500] mt-3'>Watch</h3>
              </div>
            </Link>
          </SwiperSlide>

          <SwiperSlide
            className=''>
            <Link to='/'>
              <div className='item py-5 px-2 bg-white rounded-sm text-center flex items-center justify-center flex-col'>
                <img
                  src='https://down-vn.img.susercontent.com/file/86c294aae72ca1db5f541790f7796260@resize_w640_nl.webp'
                  className='w-[60px] transition-all'
                />
                <h3 className='text-[15px] font-[500] mt-3'>Watch</h3>
              </div>
            </Link>
          </SwiperSlide>

          <SwiperSlide
            className=''>
            <Link to='/'>
              <div className='item py-5 px-2 bg-white rounded-sm text-center flex items-center justify-center flex-col'>
                <img
                  src='https://down-vn.img.susercontent.com/file/86c294aae72ca1db5f541790f7796260@resize_w640_nl.webp'
                  className='w-[60px] transition-all'
                />
                <h3 className='text-[15px] font-[500] mt-3'>Watch</h3>
              </div>
            </Link>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default HomeCatSlider;
