import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoutes = ["/cart", "/orders"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtected) return NextResponse.next();

  const refreshToken = req.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    const loginUrl = new URL("/auth/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cart/:path*", "/orders/:path*"],
};
