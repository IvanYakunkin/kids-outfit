import { AuthResponseDto } from "@/types/users";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const meResponse = await fetch("http://localhost:5000/api/auth/me", {
    method: "GET",
    cache: "no-store",
    headers: { cookie: cookieStore.toString() },
  });

  if (meResponse.ok) {
    const userData: AuthResponseDto = await meResponse.json();

    return Response.json(userData);
  }

  return Response.json(null);
}
