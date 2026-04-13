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
import { PRODUCTS, productDisplayName, productShortDesc, productPrice } from "@/lib/products";
import { getCurrency } from "@/lib/currency";
import { localizePath } from "@/lib/i18n/navigation";
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
      locale: ({ en: "en_US", es: "es_ES", de: "de_DE", fr: "fr_FR" } as Record<string, string>)[locale] || "sv_SE",
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
    alternates: {
      canonical: `https://www.1753skin.com/${locale}`,
      languages: {
        sv: "https://www.1753skin.com/sv",
        en: "https://www.1753skin.com/en",
        es: "https://www.1753skin.com/es",
        de: "https://www.1753skin.com/de",
        fr: "https://www.1753skin.com/fr",
        "x-default": "https://www.1753skin.com/en",
      },
    },
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

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.1753skin.com/#organization",
    name: "1753 SKINCARE",
    legalName: "Floranie International AB",
    url: "https://www.1753skin.com",
    logo: "https://www.1753skin.com/1753.webp",
    image: "https://www.1753skin.com/og-image.jpg",
    description: messages.meta.defaultDescription,
    foundingDate: "2020",
    founder: {
      "@type": "Person",
      "@id": "https://www.1753skin.com/#founder",
      name: "Christopher Genberg",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sodra Skjutbanevagen 10",
      addressLocality: "Asa",
      postalCode: "439 55",
      addressCountry: "SE",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+46732305521",
        email: "info@1753skin.com",
        contactType: "customer service",
        availableLanguage: ["Swedish", "English", "Spanish", "German", "French"],
      },
    ],
    sameAs: [
      "https://www.instagram.com/1753skincare",
    ],
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.1753skin.com/#website",
    name: "1753 SKINCARE",
    url: "https://www.1753skin.com",
    publisher: { "@id": "https://www.1753skin.com/#organization" },
    inLanguage: locale,
  };

  const l = locale as Locale;
  const currency = getCurrency(l);
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: l === "sv" ? "1753 SKINCARE Produkter" : l === "de" ? "1753 SKINCARE Produkte" : l === "es" ? "1753 SKINCARE Productos" : l === "fr" ? "1753 SKINCARE Produits" : "1753 SKINCARE Products",
    numberOfItems: PRODUCTS.length,
    itemListElement: PRODUCTS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: productDisplayName(p, l),
        description: productShortDesc(p, l),
        image: `https://www.1753skin.com${p.image}`,
        url: `https://www.1753skin.com${localizePath(l, "product", { productId: p.id })}`,
        brand: { "@type": "Brand", name: "1753 SKINCARE" },
        offers: {
          "@type": "Offer",
          price: productPrice(p, l),
          priceCurrency: currency,
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };

  return (
    <LocaleProvider locale={locale as Locale} messages={messages}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
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
