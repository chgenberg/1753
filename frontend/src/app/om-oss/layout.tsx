import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Om oss",
  description:
    "Lär känna 1753 SKINCARE – ett svenskt hudvårdsmärke grundat ur en frustration med en industri som prioriterar marknadsföring framför resultat.",
  openGraph: {
    title: "Om oss – 1753 SKINCARE",
    description:
      "Svensk CBD-hudvård med holistisk syn. Läs vår historia och våra värderingar.",
  },
};

export default function OmOssLayout({ children }: { children: React.ReactNode }) {
  return children;
}
