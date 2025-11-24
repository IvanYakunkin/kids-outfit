export default interface SwiperImage {
  src: string;
  alt?: string;
}

export interface CollectionSlide extends SwiperImage {
  name: string;
}
