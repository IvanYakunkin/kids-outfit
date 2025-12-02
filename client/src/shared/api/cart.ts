import { CartDto } from "@/types/cart";
import { fetchJson, FetchJsonResult } from "../fetchJson";

export async function getCart(): Promise<FetchJsonResult<CartDto[]>> {
  return fetchJson<CartDto[]>("cart", {
    method: "GET",
    credentials: "include",
  });
}

export async function addProductToCart(
  productSizeId: number
): Promise<FetchJsonResult<CartDto>> {
  return fetchJson<CartDto>("cart", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity: 1, productSizeId }),
  });
}

export async function removeProductFromCart(
  productSizeId: number
): Promise<FetchJsonResult<CartDto>> {
  return fetchJson(`cart/${productSizeId}`, {
    method: "DELETE",
    credentials: "include",
  });
}

export async function updateQuantityInCart(
  productSizeId: number,
  quantity: number
): Promise<FetchJsonResult<CartDto>> {
  return fetchJson(`cart/${productSizeId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantity }),
  });
}
