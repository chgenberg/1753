import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TopBanner } from "@/components/top-banner";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { ChatWidget } from "@/components/chat-widget";
import { CookieBanner } from "@/components/cookie-banner";
import { Analytics } from "@/components/analytics";
import { LocaleProvider } from "@/providers/locale-provider";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/types";
import { locales } from "@/lib/i18n/types";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = getMessages(locale as Locale);
  return {
    title: {
      default: messages.meta.defaultTitle,
      template: "%s – 1753 SKINCARE",
    },
    description: messages.meta.defaultDescription,
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "sv_SE",
      siteName: "1753 SKINCARE",
      title: messages.meta.defaultTitle,
      description: messages.meta.defaultDescription,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "1753 SKINCARE" }],
    },
    twitter: {
      card: "summary_large_image",
      title: messages.meta.defaultTitle,
      description: messages.meta.defaultDescription,
      images: ["/og-image.jpg"],
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const messages = getMessages(locale as Locale);

  return (
    <LocaleProvider locale={locale as Locale} messages={messages}>
      <TopBanner />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <ChatWidget />
      <CookieBanner />
      <Analytics />
    </LocaleProvider>
  );
}
