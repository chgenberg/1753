import type { Metadata } from "next";
import { Suspense } from "react";
import ReviewForm from "./review-form";

export const metadata: Metadata = {
  title: "Skriv ett omdöme – 1753 SKINCARE",
  description: "Berätta hur våra produkter fungerar för dig.",
  robots: { index: false, follow: false },
};

export default function SkrivOmdomePage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-900" /></div>}>
      <ReviewForm />
    </Suspense>
  );
}
