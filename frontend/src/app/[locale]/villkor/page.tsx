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
    title: m.legalTerms.metaTitle,
    description: m.legalTerms.metaDescription,
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const m = getMessages(l);
  const privacyPath = localizePath(l, "privacy");
  return <LegalDocument doc={m.legalTerms} privacyPath={privacyPath} />;
}
