"use client";

import SwiperImage from "@/types/common/common";
import Image from "next/image";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface IntroSwiperProps {
  swiperImages: SwiperImage[];
}

export default function IntroSwiper({ swiperImages }: IntroSwiperProps) {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      spaceBetween={0}
      slidesPerView={1}
      autoplay={{
        delay: 3000,
        disableOnInteraction: true,
      }}
      pagination={{
        el: ".swiper-pagination",
        clickable: true,
      }}
      loop={true}
    >
      {swiperImages.map((slide, index) => (
        <SwiperSlide key={index}>
          <Image
            src={slide.src}
            width={1600}
            height={550}
            style={{ width: "100%", height: "auto" }}
            alt={slide.alt || "Slide"}
          />
        </SwiperSlide>
      ))}

      <div className="swiper-pagination"></div>
    </Swiper>
  );
}
