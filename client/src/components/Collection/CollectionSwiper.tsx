"use client";

import { ProductResponseDto } from "@/types/products";
import { useRef } from "react";
import { Swiper as SwiperType } from "swiper";
import "swiper/css/bundle";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./Collection.module.css";
import CollectionItem from "./CollectionItem";

interface CollectionSwiperProps {
  title?: string;
  collection: ProductResponseDto[];
}

export default function CollectionSwiper(props: CollectionSwiperProps) {
  const nextRef = useRef<HTMLDivElement | null>(null);
  const prevRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className={styles.collection}>
      <div className="mainTitle">{props.title && props.title}</div>

      <div className={styles.navigation}>
        <div
          ref={prevRef}
          style={{ width: 15 }}
          className={styles.buttonPrev + " " + "swiper-button-prev"}
        ></div>
        <div
          ref={nextRef}
          style={{ width: 15 }}
          className={styles.buttonNext + " " + "swiper-button-next"}
        ></div>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        onInit={(swiper: SwiperType) => {
          const navigation = swiper.params.navigation;
          if (
            navigation &&
            typeof navigation === "object" &&
            !("enabled" in navigation && navigation.enabled === false)
          ) {
            if ("nextEl" in navigation && "prevEl" in navigation) {
              navigation.nextEl = nextRef.current;
              navigation.prevEl = prevRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }
          }
        }}
        breakpoints={{
          0: {
            slidesPerView: 2.2,
          },
          500: {
            slidesPerView: 2.5,
          },
          700: {
            slidesPerView: 3.3,
          },
          1000: {
            slidesPerView: 4.2,
          },
          1100: {
            slidesPerView: 5,
          },
        }}
      >
        {props.collection.map((item) => (
          <SwiperSlide key={item.id}>
            <CollectionItem item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
