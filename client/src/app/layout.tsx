import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { NavbarProvider } from "@/components/Header/Navbar/NavbarContext";
import { AuthResponseDto } from "@/types/users";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Kids-Outfit",
  description: "Online children's clothing store",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user: AuthResponseDto | null = null;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (accessToken) {
    const meResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/me`,
      {
        method: "GET",
        headers: { cookie: cookieStore.toString() },
        cache: "no-store",
      }
    );

    if (meResponse.ok) {
      user = await meResponse.json();
    }
  }

  return (
    <html lang="ru">
      <body>
        <Providers user={user}>
          <NavbarProvider>
            <Header />
            {children}
            <Footer />
          </NavbarProvider>
        </Providers>
      </body>
    </html>
  );
}
