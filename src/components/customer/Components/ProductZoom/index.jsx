import React, { useState, useRef, useEffect } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaFacebookMessenger,
} from "react-icons/fa";

const ProductZoom = ({ images, currentImage }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const zoomSliderBig = useRef(null);
  const thumbnailsRef = useRef(null);

  // Đồng bộ slideIndex với currentImage khi nó thay đổi
  useEffect(() => {
    if (currentImage && images) {
      const newIndex = images.indexOf(currentImage);
      if (newIndex !== -1 && newIndex !== slideIndex) {
        setSlideIndex(newIndex);
        if (zoomSliderBig.current && zoomSliderBig.current.swiper) {
          zoomSliderBig.current.swiper.slideTo(newIndex);
        }
      }
    }
  }, [currentImage, images]);

  const goto = (index) => {
    setSlideIndex(index);
    if (zoomSliderBig.current && zoomSliderBig.current.swiper) {
      zoomSliderBig.current.swiper.slideTo(index);
    }
  };

  const handleShare = (platform) => {
    // Logic chia sẻ (có thể thêm URL thực tế sau)
    console.log(`Chia sẻ lên ${platform}`);
  };

  if (!images || images.length === 0) {
    return (
      <div className="flex justify-center items-center h-[400px] bg-gray-50 rounded-lg">
        <div className="text-center px-6 py-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
          <p className="text-gray-600 font-medium">
            Không có hình ảnh để hiển thị.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto">
      {/* Main Zoomable Image Slider */}
      <div className="zoomContainer w-full h-[400px] overflow-hidden rounded-xl shadow-lg bg-white">
        <Swiper
          ref={zoomSliderBig}
          slidesPerView={1}
          effect="fade"
          spaceBetween={0}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          modules={[Navigation, Pagination, EffectFade]}
          className="h-full"
          onSlideChange={(swiper) => setSlideIndex(swiper.activeIndex)}
        >
          {images.map((imageUrl, index) => (
            <SwiperSlide key={index}>
              <div className="flex items-center justify-center h-full p-4">
                <Zoom
                  zoomMargin={50}
                  overlayBgColor="rgba(15, 23, 42, 0.85)"
                  wrapStyle={{ width: "100%", height: "100%" }}
                >
                  <img
                    src={imageUrl}
                    alt={`Sản phẩm ${index + 1}`}
                    className="w-full h-full object-contain transition-all duration-300"
                  />
                </Zoom>
              </div>
            </SwiperSlide>
          ))}
          <div className="swiper-button-next !text-white !bg-black/50 !w-8 !h-8 !rounded-full !right-4"></div>
          <div className="swiper-button-prev !text-white !bg-black/50 !w-8 !h-8 !rounded-full !left-4"></div>
        </Swiper>
      </div>

      {/* Wrapper for thumbnails and social sharing */}
      <div className="flex flex-col gap-4">
        {/* Thumbnail Images */}
        <div ref={thumbnailsRef} className="max-w-4xl mx-auto w-full">
          <div className="thumbnails flex justify-center gap-3 px-4 overflow-x-auto scrollbar-hide snap-x">
            {images.map((imageUrl, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex-shrink-0 cursor-pointer snap-start rounded-lg overflow-hidden 
                  ${
                    slideIndex === index
                      ? "ring-2 ring-blue-500 shadow-md shadow-blue-200"
                      : "ring-1 ring-gray-200 hover:ring-blue-300"
                  }
                  transform transition-all duration-200`}
                onClick={() => goto(index)}
              >
                <div className="relative w-14 h-14 sm:w-16 sm:h-16">
                  <img
                    src={imageUrl}
                    alt={`Thumbnail ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-300
                      ${
                        slideIndex === index
                          ? "opacity-100"
                          : "opacity-70 hover:opacity-100"
                      }`}
                  />
                  {slideIndex === index && (
                    <div className="absolute inset-0 bg-blue-500/10"></div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Social media share buttons */}
        <div className="flex items-center justify-center gap-4 border-t pt-4 mt-auto">
          <p className="text-gray-500 font-medium mr-2">Share:</p>
          <button
            onClick={() => handleShare("facebook")}
            className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            aria-label="Chia sẻ lên Facebook"
          >
            <FaFacebookF className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleShare("messenger")}
            className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-400 text-white hover:bg-blue-500 transition-colors"
            aria-label="Chia sẻ qua Messenger"
          >
            <FaFacebookMessenger className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleShare("pinterest")}
            className="flex items-center justify-center w-7 h-7 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
            aria-label="Ghim lên Pinterest"
          >
            <FaPinterestP className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleShare("instagram")}
            className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white hover:opacity-90 transition-opacity"
            aria-label="Chia sẻ lên Instagram"
          >
            <FaInstagram className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductZoom;
