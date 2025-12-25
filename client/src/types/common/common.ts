import { YearlySalesResponseDto } from "../analytics";

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

export interface ICreateProductSize {
  // If this is an old record, then use the id, otherwise - no
  id?: number;
  sizeId: number;
  quantity: number;
}

export interface ICreatePCharacteristic {
  characteristicId: number;
  value: string;
}

export interface CategorySelect {
  id: number;
  label: string;
}

export interface LoadedImage {
  file: File;
  width: number;
  height: number;
  url: string;
}

export interface ImageFromDB {
  url: string;
  name: string;
}

export type SalesStatsMonth = {
  date: string;
  sales: number;
  ordersCount: number;
};

export interface IFormattedSalesChart extends SalesStatsMonth {
  displayDate: string;
  amount: number;
  [key: string]: string | number | Date | undefined;
}

export interface IFormattedYearlySales extends YearlySalesResponseDto {
  monthDisplay: string;
  [key: string]: string | number | undefined;
}
