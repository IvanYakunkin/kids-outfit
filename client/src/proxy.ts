import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AuthResponseDto } from "./types/users";

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
  const isAuthPage =
    req.nextUrl.pathname.startsWith("/auth/login") ||
    req.nextUrl.pathname.startsWith("/auth/registration");

  const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

  if (!meResponse.ok && isAuthPage) {
    return NextResponse.next();
  }

  if (meResponse.ok) {
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/404", req.url));
    }
    const meResponseData: AuthResponseDto = await meResponse.json();
    if (isAdminPage && !meResponseData.isAdmin) {
      return NextResponse.redirect(new URL("/404", req.url));
    }
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

  if (!refreshResponse.ok && isAuthPage) {
    return NextResponse.next();
  }
  if (refreshResponse.ok) {
    const refreshData: AuthResponseDto = await refreshResponse.json();
    if (isAdminPage && !refreshData.isAdmin) {
      return NextResponse.redirect(new URL("/404", req.url));
    }
    const setCookieHeader = refreshResponse.headers.get("set-cookie");
    if (setCookieHeader) {
      const cookies = setCookieHeader.split(/,(?=\s*[a-zA-Z0-9_]+=)/);

      for (const cookieStr of cookies) {
        const parts = cookieStr.trim().split(";");
        const [nameValue] = parts;
        const [name, value] = nameValue.split("=");

        response.cookies.set(name, value, {});
      }

      if (isAuthPage) {
        return NextResponse.redirect(new URL("/404", req.url));
      }

      return response;
    }
  }

  return NextResponse.redirect(new URL("/auth/login", req.url));
}

export const config = {
  matcher: [
    "/cart",
    "/orders",
    "/checkout",
    "/admin/:path*",
    "/auth/registration",
    "/auth/login",
  ],
};
