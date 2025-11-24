import {
  PaginatedProductsDto,
  ProductInfoDto,
  ProductQueryParams,
  ProductResponseDto,
} from "@/types/products";
import { fetchJson, FetchJsonResult } from "./fetchJson";

export async function getNewProducts(
  limit = 10
): Promise<FetchJsonResult<PaginatedProductsDto>> {
  return fetchJson<PaginatedProductsDto>(
    `/products?sort=created_at&order=DESC&limit=${limit}`,
    { handle404: true, revalidate: 60 }
  );
}

export async function getPopularProducts(
  limit = 10
): Promise<FetchJsonResult<PaginatedProductsDto>> {
  return fetchJson<PaginatedProductsDto>(
    `/products?sort=sold&order=DESC&limit=${limit}`,
    { handle404: true, revalidate: 120 }
  );
}

export async function getProducts(
  params: ProductQueryParams
): Promise<FetchJsonResult<PaginatedProductsDto>> {
  const queryString = new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)])
  ).toString();

  return fetchJson<PaginatedProductsDto>(`/products?${queryString}`);
}

export async function getSimilarProducts(
  categoryId: number,
  limit = 10
): Promise<FetchJsonResult<ProductResponseDto[]>> {
  return fetchJson<ProductResponseDto[]>(
    `/products/similar/${categoryId}/${limit}`,
    { handle404: true, revalidate: 60 }
  );
}

export async function getProductById(
  id: number
): Promise<FetchJsonResult<ProductInfoDto>> {
  return fetchJson<ProductInfoDto>(`/products/${id}`, {
    revalidate: 120,
    handle404: true,
  });
}

export async function getProductsByCategory(
  categoryId: number
): Promise<FetchJsonResult<PaginatedProductsDto>> {
  return fetchJson<PaginatedProductsDto>(`/products?category=${categoryId}`);
}
