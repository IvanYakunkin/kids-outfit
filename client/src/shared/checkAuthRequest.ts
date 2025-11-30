import { AuthResponseDto } from "@/types/users";

export async function checkAuthRequest(hasRefresh: boolean = true): Promise<{
  ok: boolean;
  user: AuthResponseDto | null;
}> {
  if (!hasRefresh) {
    return { ok: false, user: null };
  }

  const me = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  if (me.ok) {
    return { ok: true, user: await me.json() };
  }

  const refresh = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  if (refresh.ok) {
    return { ok: true, user: await refresh.json() };
  }

  return { ok: false, user: null };
}
