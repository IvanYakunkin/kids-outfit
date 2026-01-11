import {
  OrderProductsDto,
  OrderResponseDto,
  QueryOrdersDto,
  StatusResponseDto,
  UpdateOrderDto,
  UpdateOrderResponseDto,
} from "@/types/order";
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

export async function getUserOrders(
  cookiesString?: string
): Promise<FetchJsonResult<OrderResponseDto[]>> {
  const fetchOptions: RequestInit = {
    method: "GET",
  };

  if (cookiesString) {
    fetchOptions.headers = {
      Cookie: cookiesString,
    };
  } else {
    fetchOptions.credentials = "include";
  }

  return fetchJson<OrderResponseDto[]>("orders/my", fetchOptions);
}

export async function getOrders<T>(
  params: QueryOrdersDto
): Promise<FetchJsonResult<T>> {
  const queryString = new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)])
  ).toString();

  return fetchJson<T>(`orders?${queryString}`, {
    method: "GET",
    credentials: "include",
  });
}

export async function getOrderById(
  id: number,
  cookiesString?: string
): Promise<FetchJsonResult<OrderResponseDto>> {
  const fetchOptions: RequestInit = {
    method: "GET",
  };

  if (cookiesString) {
    fetchOptions.headers = {
      Cookie: cookiesString,
    };
  } else {
    fetchOptions.credentials = "include";
  }

  return fetchJson(`orders/${id}`, fetchOptions);
}

export async function getStatuses() {
  return fetchJson<StatusResponseDto[]>("statuses", { method: "GET" });
}

export async function createStatus(status: string) {
  return fetchJson<StatusResponseDto>("statuses", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: status }),
  });
}

export async function updateOrder(
  orderId: number,
  updateOrderDto: UpdateOrderDto
) {
  return fetchJson<UpdateOrderResponseDto>(`orders/${orderId}`, {
    method: "PATCH",
    credentials: "include",
    body: JSON.stringify(updateOrderDto),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
