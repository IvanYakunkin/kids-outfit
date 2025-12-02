import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const refresh = req.cookies.get("refresh_token");

  if (!refresh) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  const response = NextResponse.next();

  return response;
}

export const config = {
  matcher: ["/cart", "/orders", "/checkout"],
};
