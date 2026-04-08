import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/types";
import { localizePath } from "@/lib/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = getMessages(locale as Locale);
  return {
    title: m.legalPrivacy.metaTitle,
    description: m.legalPrivacy.metaDescription,
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const m = getMessages(l);
  const privacyPath = localizePath(l, "privacy");
  return <LegalDocument doc={m.legalPrivacy} privacyPath={privacyPath} />;
}
