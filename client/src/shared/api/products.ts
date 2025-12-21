import {
  PaginatedProductsDto,
  ProductInfoDto,
  ProductQueryParams,
  ProductResponseDto,
} from "@/types/products";
import { fetchJson, FetchJsonResult } from "../fetchJson";

export async function getNewProducts(
  limit = 10
): Promise<FetchJsonResult<PaginatedProductsDto>> {
  return fetchJson<PaginatedProductsDto>(
    `products?sort=created_at&order=DESC&limit=${limit}`,
    { handle404: true, revalidate: 60 }
  );
}

export async function getPopularProducts(
  limit = 10
): Promise<FetchJsonResult<PaginatedProductsDto>> {
  return fetchJson<PaginatedProductsDto>(
    `products?sort=sold&order=DESC&limit=${limit}`,
    { handle404: true, revalidate: 120 }
  );
}

export async function getProducts<T>(
  params: ProductQueryParams
): Promise<FetchJsonResult<T>> {
  const queryString = new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)])
  ).toString();

  return fetchJson<T>(`products?${queryString}`, { handle404: true });
}

export async function getSimilarProducts(
  categoryId: number,
  limit = 10
): Promise<FetchJsonResult<ProductResponseDto[]>> {
  return fetchJson<ProductResponseDto[]>(
    `products/similar/${categoryId}/${limit}`,
    { handle404: true, revalidate: 60 }
  );
}

export async function getProductById(
  id: number
): Promise<FetchJsonResult<ProductInfoDto>> {
  return fetchJson<ProductInfoDto>(`products/${id}`, {
    handle404: true,
  });
}

export async function getProductsByCategory(
  categoryId: number
): Promise<FetchJsonResult<PaginatedProductsDto>> {
  return fetchJson<PaginatedProductsDto>(`products?category=${categoryId}`);
}

export async function createProduct(
  formData: FormData
): Promise<FetchJsonResult<ProductResponseDto>> {
  return fetchJson<ProductResponseDto>(`products`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
}

export async function editProduct(
  productId: number,
  formData: FormData
): Promise<FetchJsonResult<ProductResponseDto>> {
  return fetchJson<ProductResponseDto>(`products/${productId}`, {
    method: "PATCH",
    body: formData,
    credentials: "include",
  });
}

export async function deleteProduct(
  productId: number
): Promise<FetchJsonResult<null>> {
  return fetchJson<null>(`products/${productId}`, {
    method: "DELETE",
    credentials: "include",
  });
}
