import React from "react";
import { RxCrossCircled } from "react-icons/rx";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const ImageShow = ({ setCurrentImg, setIsShow, img, currentIndex, images }) => {
  return (
    <div className=" fixed top-0 flex items-center overflow-hidden justify-center left-0 w-full h-screen bg-black z-50">
      <RxCrossCircled
        className=" z-50 absolute top-4 right-4 md:top-6 md:right-20 text-[45px] opacity-55 transition-all duration-300 hover:opacity-100 cursor-pointer"
        onClick={() => setIsShow(false)}
      />
      {img ? (
        <img src={img} alt="" />
      ) : (
        <Swiper
          pagination={{
            dynamicBullets: true,
          }}
          modules={[Pagination]}
          initialSlide={currentIndex}
          className="mySwiper w-full h-full text-center"
        >
          {images &&
            images?.map((imgg,i) => {
              return (
                <SwiperSlide key={i} className=" w-full flex items-center justify-center">
                  <img src={imgg} alt="" className=" w-auto h-auto" />
                </SwiperSlide>
              );
            })}
        </Swiper>
      )}
    </div>
  );
};

export default ImageShow;
