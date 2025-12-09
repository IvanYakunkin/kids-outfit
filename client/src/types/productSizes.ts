import { components } from "./generated/api";

export type ProductSizesDto = components["schemas"]["ProductSizesResponseDto"];

export type Size = components["schemas"]["SizeResponseDto"];

export type CreateProductSize = components["schemas"]["SizeResponseDto"];

export type CreateProductSizeDto =
  components["schemas"]["CreateProductSizeDto"];

export type UpdateProductSizesDto =
  components["schemas"]["UpdateProductSizeDto"];
