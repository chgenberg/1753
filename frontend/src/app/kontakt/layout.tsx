import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontakta 1753 SKINCARE – vi hjälper dig med frågor om produkter, beställningar och hudvård.",
  openGraph: {
    title: "Kontakt – 1753 SKINCARE",
    description: "Har du frågor? Vi finns här för dig.",
  },
};

export default function KontaktLayout({ children }: { children: React.ReactNode }) {
  return children;
}
