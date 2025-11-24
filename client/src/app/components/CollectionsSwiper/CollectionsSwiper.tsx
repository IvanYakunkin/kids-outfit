"use client";

import { CollectionSlide } from "@/types/common/common";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./CollectionsSwiper.module.css";

interface CollectionsSwiperProps {
  collectionSlides: CollectionSlide[];
}

export default function CollectionsSwiper({
  collectionSlides,
}: CollectionsSwiperProps) {
  return (
    <div className={styles.categoriesList}>
      <div className="mainTitle">Для самых ярких</div>

      <Swiper
        spaceBetween={20}
        breakpoints={{
          0: {
            slidesPerView: 2.3,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 3.5,
          },
          1024: {
            slidesPerView: 4.3,
          },
          1200: {
            slidesPerView: 5,
          },
        }}
      >
        {collectionSlides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className={styles.slide}>
              <Image
                className={styles.image}
                src={slide.src}
                width={304}
                height={405}
                alt={slide.alt || "Collection slide"}
              />

              <div className={styles.title}>{slide.name}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
