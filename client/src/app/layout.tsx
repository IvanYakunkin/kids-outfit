import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { NavbarProvider } from "@/components/Header/Navbar/NavbarContext";
import type { Metadata } from "next";
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
  return (
    <html lang="ru">
      <body>
        <Providers>
          <AppClientWrapper>
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
