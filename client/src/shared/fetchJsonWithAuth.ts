import { fetchJson, FetchJsonOptions, FetchJsonResult } from "./fetchJson";

export async function fetchJsonWithAuth<T>(
  path: string,
  options: FetchJsonOptions = {},
  retries = 1
): Promise<FetchJsonResult<T>> {
  const result = await fetchJson<T>(path, options);
  if (!result.ok && result.status === 401 && retries > 0) {
    const res = await fetchJson("/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      return fetchJsonWithAuth<T>(path, options, retries - 1);
    } else {
      return {
        ok: false,
        status: result.status,
        error: "Истек срок действия сессии, войдите заново",
      };
    }
  }

  if (!result.ok && result.status === 401) {
    return {
      ok: false,
      status: result.status,
      error: "Истек срок действия сессии, войдите заново",
    };
  }

  return result;
}
