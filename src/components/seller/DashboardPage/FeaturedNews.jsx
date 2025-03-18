import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const bannerImages = [
  "https://down-sg.img.susercontent.com/sg-11134213-7rd75-m7g8pce6mw3aed",
  "https://down-sg.img.susercontent.com/sg-11134213-7rd6d-m7fzvpnfzw4888",
];

const FeaturedNews = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">Featured News</h2>
        <a href="#" className="text-blue-500 text-sm hover:underline">
          View More &gt;
        </a>
      </div>

      {/* Swiper Carousel */}
      <Swiper
        modules={[Navigation, Autoplay]}
        slidesPerView={1}
        navigation={true} // Hiển thị nút mũi tên
        autoplay={{ delay: 3000, disableOnInteraction: false }} // Tự động chạy
        loop={true} // Lặp vô hạn
        className="rounded-lg overflow-hidden"
      >
        {bannerImages.map((image, index) => (
          <SwiperSlide key={index}>
            <img src={image} alt={`Slide ${index}`} className="w-full h-auto" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeaturedNews;
