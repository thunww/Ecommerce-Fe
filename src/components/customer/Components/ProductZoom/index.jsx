import React from 'react';
import { useRef, useState } from 'react';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
const ProductZoom = () => {

    const [slideIndex, setSlideIndex] = useState(0);
    const zoomSliderBig = useRef();
    const zoomSliderSml = useRef();
    const goto = (index) => {
        setSlideIndex(index);
        zoomSliderBig.current.swiper.slideTo(index);
        zoomSliderSml.current.swiper.slideTo(index);
    }
    return (
        <>
            <div className='flex gap-3'>
                <div className='slider w-[15%]'>
                    <Swiper
                        ref={zoomSliderSml}
                        direction={'vertical'}
                        slidesPerView={4}
                        spaceBetween={0}
                        navigation={true}
                        modules={[Navigation]}
                        className='zoomProductSliderThumbs h-[500px] overflow-hidden'
                    >
                        <SwiperSlide>
                            <div className={`item rounded-md overflow-hidden cursor-pointer group ${slideIndex == 0 ? 'opacity-1' : 'opacity-30'}`}
                                onClick={() => goto(0)}>
                                <img src='https://img.lazcdn.com/g/p/4e991e25c92b980b56aed006ec7e8a2d.jpg_720x720q80.jpg_.webp'
                                    className='w-full transition-all group-hover:scale-105' />
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className={`item rounded-md overflow-hidden cursor-pointer group ${slideIndex == 1 ? 'opacity-1' : 'opacity-30'}`}
                                onClick={() => goto(1)}>
                                <img src='https://img.lazcdn.com/g/p/2c889567bef0266709b53d05244d8809.jpg_720x720q80.jpg_.webp'
                                    className='w-full transition-all group-hover:scale-105' />
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className={`item rounded-md overflow-hidden cursor-pointer group ${slideIndex == 2 ? 'opacity-1' : 'opacity-30'}`}
                                onClick={() => goto(2)}>
                                <img src='/productimg2.webp'
                                    className='w-full transition-all group-hover:scale-105' />
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className={`item rounded-md overflow-hidden cursor-pointer group ${slideIndex == 3 ? 'opacity-1' : 'opacity-30'}`}
                                onClick={() => goto(3)}>
                                <img src='/productimg1.jpg'
                                    className='w-full transition-all group-hover:scale-105' />
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className={`item rounded-md overflow-hidden cursor-pointer group ${slideIndex == 4 ? 'opacity-1' : 'opacity-30'}`}
                                onClick={() => goto(4)}>
                                <img src='/productimg1.jpg'
                                    className='w-full transition-all group-hover:scale-105' />
                            </div>
                        </SwiperSlide>

                        <SwiperSlide></SwiperSlide>
                    </Swiper>
                </div>


                <div className='zoomContainer w-[85%] h-[500px] overflow-hidden rounded-md'>
                    <Swiper
                        ref={zoomSliderBig}
                        slidesPerView={1}
                        spaceBetween={0}
                        navigation={false}
                    >
                        <SwiperSlide>
                            <InnerImageZoom
                                zoomType="hover"
                                zoomScale={1}
                                src={"https://img.lazcdn.com/g/p/4e991e25c92b980b56aed006ec7e8a2d.jpg_720x720q80.jpg_.webp"} />
                        </SwiperSlide>

                        <SwiperSlide>
                            <InnerImageZoom
                                zoomType="hover"
                                zoomScale={1}
                                src={"https://img.lazcdn.com/g/p/2c889567bef0266709b53d05244d8809.jpg_720x720q80.jpg_.webp"} />
                        </SwiperSlide>

                        <SwiperSlide>
                            <InnerImageZoom
                                zoomType="hover"
                                zoomScale={1}
                                src={"/productimg2.webp"} />
                        </SwiperSlide>

                        <SwiperSlide>
                            <InnerImageZoom
                                zoomType="hover"
                                zoomScale={1}
                                src={"/productimg1.jpg"} />
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div >
        </>
    )
}

export default ProductZoom
