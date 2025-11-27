import { ProductSizesDto } from "@/types/productSizes";
import { fetchJson, FetchJsonResult } from "../fetchJson";

export async function getProductSizes(
  productId: number
): Promise<FetchJsonResult<ProductSizesDto[]>> {
  return fetchJson<ProductSizesDto[]>(`/product-sizes/product/${productId}`);
}
