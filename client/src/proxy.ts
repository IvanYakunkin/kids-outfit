import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const access = req.cookies.get("access_token");
  const refresh = req.cookies.get("refresh_token");
  if (!refresh) {
    //console.log("Отсутствует refresh");
    return NextResponse.next();
  }

  // Check access
  if (access) {
    const accessRef = await fetch(`${process.env.API_URL}/auth/me`, {
      method: "GET",
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    });

    if (accessRef.ok) {
      //console.log("Access");
      return NextResponse.next();
    }
  }

  // Check refresh
  const refreshRes = await fetch(`${process.env.API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      Cookie: req.headers.get("cookie") || "",
    },
  });

  if (!refreshRes.ok) {
    //console.log("Невалидный Refresh");
    return NextResponse.next();
  }

  const response = NextResponse.next();

  refreshRes.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      response.headers.append("Set-Cookie", value);
    }
  });

  //console.log("Refresh");

  return response;
}

export const config = {
  matcher: ["/api/auth/me"],
};
