"use client";

import { ProductImageDto } from "@/types/products";
import Image from "next/image";
import React, { useRef, useState } from "react";
import SwiperCore, { Swiper as SwiperType } from "swiper";
import "swiper/css/bundle";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./ProductSwiper.module.css";

interface ProductSwiperProps {
  images?: ProductImageDto[];
}

type initializeNavigationProps = {
  next: React.RefObject<HTMLDivElement | null>;
  prev: React.RefObject<HTMLDivElement | null>;
  slider: React.RefObject<SwiperCore | null>;
};

export default function ProductSwiper({ images }: ProductSwiperProps) {
  const previewSlider = useRef<SwiperType>(null);
  const mainSlider = useRef<SwiperType>(null);

  const previewNextRef = useRef<HTMLDivElement>(null);
  const previewPrevRef = useRef<HTMLDivElement>(null);

  const mainNextRef = useRef<HTMLDivElement>(null);
  const mainPrevRef = useRef<HTMLDivElement>(null);

  const [selectedSlide, setSelectedSlide] = useState<number>(0);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);

  // Initialize navigation buttons
  function initializeNavigation({
    next,
    prev,
    slider,
  }: initializeNavigationProps) {
    if (next.current && prev.current && slider.current) {
      const swiper: SwiperType = slider.current;
      if (swiper.params.navigation) {
        const navigation = swiper.params.navigation;
        if (navigation !== true) {
          navigation.nextEl = next.current;
          navigation.prevEl = prev.current;
        }
      }

      swiper.navigation.init();
      swiper.navigation.update();
    }
  }

  const changeSlide = (index: number) => {
    thumbsSwiper?.slideTo(index);
    setSelectedSlide(index);
  };

  const changeSelectedSlide = (swiper: SwiperType) => {
    const currentSlideId: number = Number(swiper.slides[swiper.activeIndex].id);
    setSelectedSlide(currentSlideId);
    previewSlider.current?.slideTo(currentSlideId);
  };

  return (
    <div className={styles.productSlider}>
      <div className={styles.previewSlider}>
        <div
          ref={previewPrevRef}
          className={"swiper-button-prev" + " " + styles.previewNavPrev}
        ></div>
        <Swiper
          modules={[Navigation, Thumbs]}
          direction={"vertical"}
          style={{ height: "580px" }}
          slidesPerView={4}
          thumbs={{ swiper: thumbsSwiper }}
          onSwiper={(swiper: SwiperType) => {
            previewSlider.current = swiper;
            setTimeout(() => {
              initializeNavigation({
                next: previewNextRef,
                prev: previewPrevRef,
                slider: previewSlider,
              });
            }, 0);
          }}
        >
          {images && images.length > 0 ? (
            images.map((image, index) => (
              <SwiperSlide key={index} onClick={() => changeSlide(index)}>
                <div
                  className={
                    selectedSlide == index
                      ? styles.previewImage + " " + styles.active
                      : styles.previewImage
                  }
                >
                  <Image
                    src={image.url}
                    width={100}
                    height={136}
                    alt="Product Photo"
                  />
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className={styles.previewImage + " " + styles.active}>
                <Image
                  src="/images/content/default.jpg"
                  width={100}
                  height={136}
                  alt="Product Photo"
                />
              </div>
            </SwiperSlide>
          )}
        </Swiper>
        <div
          ref={previewNextRef}
          className={"swiper-button-next" + " " + styles.previewNavNext}
        ></div>
      </div>
      <div className={styles.mainSlider}>
        <div
          ref={mainPrevRef}
          className={styles.mainNavPrev + " " + "swiper-button-prev"}
        ></div>
        <Swiper
          modules={[Navigation, Thumbs, Pagination]}
          slidesPerView={1}
          onSwiper={(swiper: SwiperType) => {
            mainSlider.current = swiper;
            setThumbsSwiper(swiper);
            setTimeout(() => {
              initializeNavigation({
                next: mainNextRef,
                prev: mainPrevRef,
                slider: mainSlider,
              });
            }, 0);
          }}
          pagination={{ clickable: true }}
          className={styles.mainSlide}
          watchSlidesProgress={true}
          onSlideChange={changeSelectedSlide}
        >
          {images && images.length > 0 ? (
            images.map((image, index) => (
              <SwiperSlide key={image.id} id={index.toString()}>
                <Image
                  src={image.url}
                  className={styles.mainSlider__image}
                  width={520}
                  height={720}
                  alt="Product Photo"
                />
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <Image
                src="/images/content/default.jpg"
                className={styles.mainSlider__image}
                width={520}
                height={720}
                alt="Product Photo"
              />
            </SwiperSlide>
          )}
        </Swiper>
        <div
          ref={mainNextRef}
          className={styles.mainNavNext + " " + "swiper-button-next"}
        ></div>
      </div>
    </div>
  );
}
