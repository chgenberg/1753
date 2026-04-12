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
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-icon.png",
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
