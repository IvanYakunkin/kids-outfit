import { components } from "./generated/api";

export type ProductResponseDto = components["schemas"]["ProductsResponseDto"];

export type ProductsMetaDto = components["schemas"]["MetaProductsDto"];

export type PaginatedProductsDto = {
  data: ProductResponseDto[];
  meta: ProductsMetaDto;
};

export type ProductImageDto = components["schemas"]["ProductImageResponseDto"];

export type ProductInfoDto = components["schemas"]["ProductResponseDto"];

export type ProductQueryParams = components["schemas"]["QueryProductsDto"];

export type CreateProductDto = components["schemas"]["CreateProductDto"];
