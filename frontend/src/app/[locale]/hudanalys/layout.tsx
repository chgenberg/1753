import type { Metadata } from "next";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = getMessages(locale as Locale).analysisLayoutSeo;
  return {
    title: m.title,
    description: m.description,
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
    },
  };
}

export default function HudanalysLayout({ children }: { children: React.ReactNode }) {
  return children;
}
