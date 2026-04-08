import type { Metadata } from "next";
import { Suspense } from "react";
import ReviewForm from "./review-form";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = getMessages(locale as Locale).reviewFormPage;
  return {
    title: m.metaTitle,
    description: m.metaDescription,
    robots: { index: false, follow: false },
  };
}

export default function SkrivOmdomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-900" />
        </div>
      }
    >
      <ReviewForm />
    </Suspense>
  );
}
