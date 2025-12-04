import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const response = NextResponse.next();

  const cookieStore = await cookies();

  const meResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      cookie: cookieStore.toString(),
    },
  });

  if (meResponse.ok) {
    return response;
  }

  const refreshResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        cookie: cookieStore.toString(),
      },
    }
  );

  if (refreshResponse.ok) {
    const setCookieHeader = refreshResponse.headers.get("set-cookie");
    if (setCookieHeader) {
      const cookies = setCookieHeader.split(/,(?=\s*[a-zA-Z0-9_]+=)/);

      for (const cookieStr of cookies) {
        const parts = cookieStr.trim().split(";");
        const [nameValue] = parts;
        const [name, value] = nameValue.split("=");

        response.cookies.set(name, value, {});
      }

      return response;
    }
  }

  return NextResponse.redirect(new URL("/auth/login", req.url));
}

export const config = {
  matcher: ["/cart", "/orders", "/checkout"],
};
