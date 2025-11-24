import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { NavbarProvider } from "@/components/Header/Navbar/NavbarContext";
import { AuthResponseDto } from "@/types/users";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AppClientWrapper } from "./appClientWrapper";
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
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const refresh_token = cookieStore.get("refresh_token");
  const access_token = cookieStore.get("access_token");

  let user: AuthResponseDto | null = null;
  if (access_token) {
    const isAccessRes = await fetch(`http://localhost:5000/api/auth/me`, {
      method: "GET",
      headers: { cookie: cookieHeader },
    });

    if (isAccessRes.ok) {
      user = await isAccessRes.json();
    }
  }

  return (
    <html lang="ru">
      <body>
        <Providers user={user}>
          <AppClientWrapper hasRefreshToken={refresh_token ? true : false}>
            <NavbarProvider>
              <Header />
              {children}
              <Footer />
            </NavbarProvider>
          </AppClientWrapper>
        </Providers>
      </body>
    </html>
  );
}
