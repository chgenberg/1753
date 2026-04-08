import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/providers/cart-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { TopBanner } from "@/components/top-banner";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { ChatWidget } from "@/components/chat-widget";
import { Toaster } from "@/components/notification";
import { CookieBanner } from "@/components/cookie-banner";
import { Analytics } from "@/components/analytics";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "1753 SKINCARE – CBD-hudvård för nordisk hud",
    template: "%s – 1753 SKINCARE",
  },
  description:
    "Svenskt hudvårdsmärke med CBD/CBG-baserade produkter. Ärlig, varm och effektiv hudvård utvecklad för nordisk hud.",
  metadataBase: new URL("https://1753skincare.com"),
  openGraph: {
    type: "website",
    locale: "sv_SE",
    siteName: "1753 SKINCARE",
    title: "1753 SKINCARE – CBD-hudvård för nordisk hud",
    description:
      "Svenskt hudvårdsmärke med CBD/CBG-baserade produkter. Ärlig, varm och effektiv hudvård utvecklad för nordisk hud.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "1753 SKINCARE" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "1753 SKINCARE – CBD-hudvård för nordisk hud",
    description:
      "Svensk hudvård med CBD och CBG, utvecklad för nordisk hud.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
    <html lang="sv" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-inter)]">
        <AuthProvider>
          <CartProvider>
            <Toaster>
              <TopBanner />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
              <ChatWidget />
              <CookieBanner />
              <Analytics />
            </Toaster>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
