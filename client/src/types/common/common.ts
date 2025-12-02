export default interface SwiperImage {
  src: string;
  alt?: string;
}

export interface CollectionSlide extends SwiperImage {
  name: string;
}

export interface IAddress {
  postalcode: string;
  region: string;
  city: string;
  street: string;
  house: string;
  apartment?: string;
}
