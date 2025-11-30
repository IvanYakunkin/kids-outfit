import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { checkAuthRequest } from "./checkAuthRequest";
import { FetchJsonResult } from "./fetchJson";

export async function authRequestWrapper<T>(
  requestFn: () => Promise<FetchJsonResult<T>>,
  router: AppRouterInstance
): Promise<FetchJsonResult<T>> {
  const authResponse = await checkAuthRequest();
  if (!authResponse.ok) {
    //router.push("/auth/login");
    console.log("ошибка", authResponse.user);
  }

  const response = await requestFn();

  if (!response.ok) {
    console.log("Ошибка выполнения запроса");
  }

  return response;
}
