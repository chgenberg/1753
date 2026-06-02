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
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical: `https://www.1753skin.com/${locale}`,
      languages: {
        sv: "https://www.1753skin.com/sv",
        en: "https://www.1753skin.com/en",
        es: "https://www.1753skin.com/es",
        de: "https://www.1753skin.com/de",
        fr: "https://www.1753skin.com/fr",
        "x-default": "https://www.1753skin.com/sv",
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
      "https://www.1753skin.com",
      "https://www.instagram.com/1753.skincare",
      "https://www.facebook.com/1753skincare",
      "https://www.tiktok.com/@1753skincare",
      "https://www.linkedin.com/company/1753skincare",
      "https://www.youtube.com/@1753skincare",
      "https://www.1753skincare.com",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      bestRating: "5",
      worstRating: "1",
      reviewCount: String(PRODUCTS.reduce((sum, p) => sum + (p.reviews || 0), 0)),
    },
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.1753skin.com/#localbusiness",
    name: "1753 SKINCARE",
    legalName: "Floranie International AB",
    image: "https://www.1753skin.com/og-image.jpg",
    logo: "https://www.1753skin.com/1753.webp",
    url: "https://www.1753skin.com",
    telephone: "+46732305521",
    email: "info@1753skin.com",
    priceRange: "399-1495 SEK",
    currenciesAccepted: "SEK, EUR",
    paymentAccepted: "Credit Card, Apple Pay, Google Pay, Swish, Klarna",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sodra Skjutbanevagen 10",
      addressLocality: "Asa",
      postalCode: "439 55",
      addressRegion: "Halland",
      addressCountry: "SE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 57.3498,
      longitude: 12.1254,
    },
    areaServed: [
      { "@type": "Country", name: "Sweden" },
      { "@type": "Country", name: "Germany" },
      { "@type": "Country", name: "France" },
      { "@type": "Country", name: "Spain" },
      { "@type": "Country", name: "United Kingdom" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
    ],
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.1753skin.com/#website",
    name: "1753 SKINCARE",
    url: "https://www.1753skin.com",
    publisher: { "@id": "https://www.1753skin.com/#organization" },
    inLanguage: ["sv", "en", "es", "de", "fr"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `https://www.1753skin.com/${locale}/guide?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
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
          itemCondition: "https://schema.org/NewCondition",
          priceValidUntil: new Date(Date.now() + 90 * 86_400_000).toISOString().slice(0, 10),
        },
      },
    })),
  };

  const navSchema = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: [
      messages.header.navHome,
      messages.header.navProducts,
      messages.header.navAbout,
      messages.header.navContact,
    ],
    url: [
      `https://www.1753skin.com${localizePath(l, "home")}`,
      `https://www.1753skin.com${localizePath(l, "products")}`,
      `https://www.1753skin.com${localizePath(l, "about")}`,
      `https://www.1753skin.com${localizePath(l, "contact")}`,
    ],
  };

  return (
    <LocaleProvider locale={locale as Locale} messages={messages}>
      {/* Resource hints — reduce round-trip time for API calls and fonts */}
      <link rel="preconnect" href="https://api.1753skin.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://api.1753skin.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(navSchema) }}
      />
      <TopBanner />
      <Header />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <ChatWidget />
      <CookieBanner />
      <Analytics />
    </LocaleProvider>
  );
}
