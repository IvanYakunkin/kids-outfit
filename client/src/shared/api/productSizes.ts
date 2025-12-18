import { ICreateProductSize } from "@/types/common/common";
import {
  CreateProductSizeDto,
  ProductSizesDto,
  Size,
  UpdateProductSizesDto,
} from "@/types/productSizes";
import { fetchJson, FetchJsonResult } from "../fetchJson";

export async function getProductSizes(
  productId: number
): Promise<FetchJsonResult<ProductSizesDto[]>> {
  return fetchJson<ProductSizesDto[]>(`product-sizes/product/${productId}`);
}

export async function getSizes(): Promise<FetchJsonResult<Size[]>> {
  return fetchJson<Size[]>("sizes", { method: "GET", credentials: "include" });
}

export async function createProductSizes(
  productId: number,
  productSizes: CreateProductSizeDto[]
): Promise<FetchJsonResult<ProductSizesDto[]>> {
  return fetchJson<ProductSizesDto[]>(`product-sizes/${productId}`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(productSizes),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function callCreateProductSizes(
  productId: number,
  productSizes: ICreateProductSize[]
) {
  const productSizesRes = await createProductSizes(
    productId,
    productSizes.map((ps) => ({
      sizeId: ps.sizeId,
      isAvailable: true,
      quantity: ps.quantity,
    }))
  );
  if (!productSizesRes.ok) {
    console.log(productSizesRes.error);
    return false;
  }

  return true;
}

export async function updateProductSizes(
  productId: number,
  productSizes: UpdateProductSizesDto[]
): Promise<FetchJsonResult<ProductSizesDto[]>> {
  return fetchJson<ProductSizesDto[]>(`product-sizes/${productId}`, {
    method: "PATCH",
    credentials: "include",
    body: JSON.stringify(productSizes),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function callUpdateProductSizes(
  productId: number,
  productSizes: ICreateProductSize[]
) {
  const productSizesRes = await updateProductSizes(
    productId,
    productSizes.map((ps) => ({
      id: ps.id,
      sizeId: ps.sizeId,
      isAvailable: true,
      quantity: ps.quantity,
    }))
  );
  if (!productSizesRes.ok) {
    console.log(productSizesRes.error);
    return false;
  }

  return true;
}

export async function deleteSize(sizeId: number) {
  return fetchJson(`sizes/${sizeId}`, {
    method: "DELETE",
    credentials: "include",
  });
}

export async function createSize(name: string): Promise<FetchJsonResult<Size>> {
  return fetchJson<Size>(`sizes`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ name }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
