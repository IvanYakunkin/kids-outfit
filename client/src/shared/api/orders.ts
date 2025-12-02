import { OrderProductsDto, OrderResponseDto } from "@/types/order";
import { fetchJson, FetchJsonResult } from "../fetchJson";

export async function addOrder(
  address: string,
  products: OrderProductsDto[]
): Promise<FetchJsonResult<OrderResponseDto>> {
  return fetchJson<OrderResponseDto>("orders", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, products }),
  });
}

export async function getUserOrders(): Promise<
  FetchJsonResult<OrderResponseDto[]>
> {
  return fetchJson<OrderResponseDto[]>("orders/my", {
    method: "GET",
    credentials: "include",
  });
}
