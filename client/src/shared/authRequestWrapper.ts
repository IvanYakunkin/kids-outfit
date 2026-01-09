import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { checkAuthRequest } from "./checkAuthRequest";
import { FetchJsonResult } from "./fetchJson";

export async function authRequestWrapper<T>(
  requestFn: () => Promise<FetchJsonResult<T>>,
  router: AppRouterInstance,
  cancelRedirect?: true
): Promise<FetchJsonResult<T>> {
  const authResponse = await checkAuthRequest();
  if (!authResponse.ok) {
    if (cancelRedirect) {
      return authResponse;
    }
    router.push("/auth/login");
    return authResponse;
  }

  return await requestFn();
}
