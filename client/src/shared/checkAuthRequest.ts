import { AuthResponseDto } from "@/types/users";

export async function checkAuthRequest(hasRefresh: boolean = true): Promise<{
  ok: boolean;
  user: AuthResponseDto | null;
  status: number;
}> {
  if (!hasRefresh) {
    return { ok: false, user: null, status: 401 };
  }

  const me = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  if (me.ok) {
    return { ok: true, user: await me.json(), status: me.status };
  }

  const refresh = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  if (refresh.ok) {
    return { ok: true, user: await refresh.json(), status: refresh.status };
  }

  return { ok: false, user: null, status: refresh.status };
}
