import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Hudanalys",
  description:
    "Få personliga hudvårdsrekommendationer med 1753 SKINCAREs AI-drivna hudanalys. Gratis och anonymt.",
  openGraph: {
    title: "AI Hudanalys – 1753 SKINCARE",
    description:
      "Ladda upp ett foto och få en holistisk hudanalys med personliga rekommendationer.",
  },
};

export default function HudanalysLayout({ children }: { children: React.ReactNode }) {
  return children;
}
