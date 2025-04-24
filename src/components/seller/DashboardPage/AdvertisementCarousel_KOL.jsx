import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

const AdvertisementLivestream = () => {
    const images = [
        "https://cf.shopee.vn/file/vn-11134258-7ra0g-m6zggds6byxt8d_xxhdpi",
        "https://cf.shopee.vn/file/vn-11134258-7ra0g-m6zggds6byxt8d_xxhdpi",
        "https://cf.shopee.vn/file/vn-11134258-7ra0g-m6zg8u93ojlk86_xxhdpi"
    ];

    return (
        <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            spaceBetween={10}
            slidesPerView={1}
            className="w-full h-[360px] rounded-lg shadow"
        >
            {images.map((src, index) => (
                <SwiperSlide key={index}>
                    <img src={src} alt={`Ad ${index + 1}`} className="w-full h-full object-cover rounded-lg he" />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default AdvertisementLivestream;
