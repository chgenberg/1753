import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/providers/cart-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { Toaster } from "@/components/notification";
import { HtmlLang } from "@/components/html-lang";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.1753skin.com"),
  icons: {
    icon: "/1753.webp",
    apple: "/1753.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-inter)]">
        <HtmlLang />
        <AuthProvider>
          <CartProvider>
            <Toaster>{children}</Toaster>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
