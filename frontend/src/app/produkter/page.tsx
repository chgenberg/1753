import type { Metadata } from "next";
import { ProductGrid } from "./product-grid";

export const metadata: Metadata = {
  title: "Produkter",
  description:
    "Utforska 1753 SKINCAREs sortiment av CBD- och CBG-baserad hudvård. Ansiktsoljor, serum, rengöring och kosttillskott.",
  openGraph: {
    title: "Produkter – 1753 SKINCARE",
    description:
      "CBD- och CBG-baserad hudvård för nordisk hud. Ansiktsoljor, serum och mer.",
  },
};

export default function ProductsPage() {
  return <ProductGrid />;
}
