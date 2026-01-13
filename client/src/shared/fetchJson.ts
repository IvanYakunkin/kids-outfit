import Cookies from "js-cookie";

export interface FetchJsonResult<T> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}

export interface FetchJsonOptions extends RequestInit {
  handle404?: boolean;
  revalidate?: number;
}

export interface ServerMsgError {
  message: string;
  error: string;
  statusCode: number;
}

export interface ServerError {
  message: ServerMsgError;
  statusCode: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

export async function fetchJson<T>(
  path: string,
  options: FetchJsonOptions = {}
): Promise<FetchJsonResult<T>> {
  const { handle404 = false, revalidate, ...fetchOptions } = options;

  const isGet =
    !fetchOptions.method || fetchOptions.method.toUpperCase() === "GET";

  const fetchParams: RequestInit & { next?: { revalidate?: number | false } } =
    {
      ...fetchOptions,
    };

  if (!isGet) {
    const csrfToken = Cookies.get("XSRF-TOKEN");
    if (csrfToken) {
      fetchParams.headers = {
        ...fetchParams.headers,
        "X-CSRF-Token": csrfToken,
      };
    }
    fetchParams.cache = "no-store";
  } else if (typeof revalidate === "number") {
    fetchParams.next = { revalidate: revalidate };
  } else if (revalidate === undefined) {
    fetchParams.cache = "no-store";
  } else {
    fetchParams.cache = "force-cache";
  }

  let response: Response;

  try {
    response = await fetch(`${BASE_URL}/${path}`, fetchParams);
  } catch {
    return {
      ok: false,
      status: 0,
      error: "Сервер недоступен",
    };
  }

  if (response.status === 404 && handle404) {
    return {
      ok: false,
      status: 404,
      error: "Не найдено",
    };
  }

  let json: unknown = null;
  try {
    json = await response.json();
  } catch {
    json = null;
  }

  if (response.ok) {
    return {
      ok: true,
      status: response.status,
      data: json as T,
    };
  }

  let errorMessage = "Ошибка сервера";
  if (typeof json === "object" && json !== null) {
    const serverErr = json as ServerError;
    if (serverErr.message?.message) {
      errorMessage = serverErr.message.message;
    }
  }

  return {
    ok: false,
    status: response.status,
    error: errorMessage,
  };
}
