import {
  DashboardKpis,
  LogVisitResponseDto,
  MonthlySalesResponseDto,
  YearlySalesResponseDto,
} from "@/types/analytics";
import { fetchJson, FetchJsonResult } from "../fetchJson";

export async function logVisit(): Promise<
  FetchJsonResult<LogVisitResponseDto>
> {
  return fetchJson<LogVisitResponseDto>("analytics/hit", {
    method: "POST",
    credentials: "include",
  });
}

export async function getKpis(
  cookiesString?: string
): Promise<FetchJsonResult<DashboardKpis>> {
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
  return fetchJson<DashboardKpis>("analytics/kpis", fetchOptions);
}

export async function getSalesPerMonth(): Promise<
  FetchJsonResult<MonthlySalesResponseDto[]>
> {
  return fetchJson("analytics/sales-per-month", {
    method: "GET",
    credentials: "include",
  });
}

export async function getSalesPerYear(): Promise<
  FetchJsonResult<YearlySalesResponseDto[]>
> {
  return fetchJson("analytics/sales-per-year", {
    method: "GET",
    credentials: "include",
  });
}
