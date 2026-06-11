import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import { LenisProvider } from "@/components/demo/lenis-provider";
import { DemoHeader } from "@/components/demo/demo-header";

// Elegant display-serif för stora rubriker – motsvarigheten till
// claudetype:s ornamentala serif, men via Google Fonts.
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "1753 SKINCARE – Designdemo",
  robots: { index: false, follow: false },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${fraunces.variable} bg-[#f5f5f7] text-[#1d1d1f] antialiased`}>
      <LenisProvider>
        <DemoHeader />
        {children}
      </LenisProvider>
    </div>
  );
}
