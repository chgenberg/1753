export interface Product {
  id: string;
  articleNumber: string;
  category: "oil" | "serum" | "kit" | "cleanser" | "supplement";
  name: string;
  price: number;
  originalPrice: number | null;
  reviews: number;
  image: string;
  imageAlt: string;
  shortDesc: string;
  description: string;
  ingredients: string | null;
  size: string | null;
  sizes?: string[];
  guarantee: string;
  vatRate: number;
}

export const PRODUCTS: Product[] = [
  {
    id: "duo-ta-da",
    articleNumber: "4004",
    category: "kit",
    name: "DUO-kit + TA-DA Serum",
    price: 1495,
    originalPrice: 2197,
    reviews: 89,
    image: "/New_Products/DUO+TA-DA.jpg",
    imageAlt: "/New_Products/DUO+TA-DAWoman.jpg",
    shortDesc:
      "En komplett rutin för hud i balans. Innehåller The ONE Facial Oil, I LOVE Facial Oil och TA-DA Serum.",
    description: `<p>Det här är en hudvårdsrutin skapad för att stärka huden på djupet – inte tillfälligt förbättra ytan.</p>`,
    ingredients: null,
    size: null,
    guarantee:
      "100% nöjd-kund-garanti. Prova produkterna i 14 dagar. Är du inte nöjd får du pengarna tillbaka.",
    vatRate: 0.25,
  },
  {
    id: "ta-da-serum",
    articleNumber: "1005",
    category: "serum",
    name: "TA-DA Serum",
    price: 699,
    originalPrice: null,
    reviews: 156,
    image: "/New_Products/TA-DA.jpg",
    imageAlt: "/New_Products/TA-DAWoman.jpg",
    shortDesc:
      "CBG-berikat serum som boostar fukt, elasticitet och lyster. Appliceras efter ansiktsolja.",
    description: `<p>TA-DA Serum är ett unikt CBG-berikat serum som ger huden en extra boost.</p>`,
    ingredients:
      "Aqua, Aloe Barbadensis Leaf Juice, Cannabigerol (3% / 900 mg), Hyaluronic Acid",
    size: "30 ml",
    sizes: ["30 ml"],
    guarantee:
      "100% nöjd-kund-garanti. Prova i 14 dagar, och om du inte är nöjd, skicka tillbaka.",
    vatRate: 0.25,
  },
  {
    id: "duo-kit",
    articleNumber: "1003",
    category: "kit",
    name: "DUO-kit",
    price: 1099,
    originalPrice: 1498,
    reviews: 204,
    image: "/New_Products/DUO.jpg",
    imageAlt: "/New_Products/DUOwoman.jpg",
    shortDesc:
      "Två ansiktsoljor i ett kit. The ONE för morgonen, I LOVE för kvällen.",
    description: `<p>Ge din hud det bästa av två världar med vårt DUO-kit!</p>`,
    ingredients: null,
    size: "2 x 10 ml glasflaskor med pipett",
    guarantee:
      "100% nöjd-kund-garanti. Prova produkterna i 14 dagar.",
    vatRate: 0.25,
  },
  {
    id: "i-love-facial-oil",
    articleNumber: "3001",
    category: "oil",
    name: "I LOVE Facial Oil",
    price: 849,
    originalPrice: null,
    reviews: 178,
    image: "/New_Products/ILOVE.jpg",
    imageAlt: "/New_Products/ILOVEWoman.jpg",
    shortDesc:
      "Nattolja med 10% CBD och 5% CBG. Reparerar, lugnar och djupåterfuktar medan du sover.",
    description: `<p>I LOVE Facial Oil är din huds bästa vän på natten.</p>`,
    ingredients:
      "Caprylic/Capric Triglyceride, Cannabidiol (10% / 1000 mg), Cannabigerol (5% / 500 mg)",
    size: "10 ml",
    sizes: ["10 ml"],
    guarantee:
      "100% nöjd-kund-garanti. Prova i 14 dagar.",
    vatRate: 0.25,
  },
  {
    id: "the-one-facial-oil",
    articleNumber: "1001",
    category: "oil",
    name: "The ONE Facial Oil",
    price: 649,
    originalPrice: null,
    reviews: 202,
    image: "/New_Products/TheONE.jpg",
    imageAlt: "/New_Products/TheONEWoman.jpg",
    shortDesc:
      "Ansiktsolja med 10% CBD och 0,2% CBG. Mindre inflammationer, mer glow.",
    description: `<p>The ONE Facial Oil är den perfekta dagliga ansiktsoljan.</p>`,
    ingredients:
      "Caprylic/Capric Triglyceride, Cannabis Sativa Seed Oil, Cannabidiol (10%), Cannabigerol (0.2%)",
    size: "10 ml",
    sizes: ["10 ml"],
    guarantee:
      "100% nöjd-kund-garanti. Prova i 14 dagar.",
    vatRate: 0.25,
  },
  {
    id: "au-naturel-makeup-remover",
    articleNumber: "1004",
    category: "cleanser",
    name: "Au Naturel Makeup Remover",
    price: 399,
    originalPrice: null,
    reviews: 134,
    image: "/New_Products/MR.jpg",
    imageAlt: "/New_Products/MRwoman.jpg",
    shortDesc:
      "Rengöringsolja med MCT och CBD. Löser smink varsamt utan att störa hudens mikrobiom.",
    description: `<p>Au Naturel är en rengöringsolja som tar bort smink utan att rubba hudens naturliga balans.</p>`,
    ingredients:
      "Caprylic/Capric Triglyceride (MCT Oil), Cannabis Sativa Seed Oil, Cannabidiol",
    size: "100 ml",
    sizes: ["100 ml"],
    guarantee:
      "100% nöjd-kund-garanti. Prova i 14 dagar.",
    vatRate: 0.25,
  },
  {
    id: "fungtastic-mushroom-extract",
    articleNumber: "4001",
    category: "supplement",
    name: "Fungtastic Mushroom Extract",
    price: 399,
    originalPrice: null,
    reviews: 67,
    image: "/New_Products/Fungtastic.jpg",
    imageAlt: "/New_Products/Fungtasticwoman.jpg",
    shortDesc:
      "Chaga, Lion's Mane, Cordyceps och Reishi. Stöd för immunförsvar, fokus och energi.",
    description: `<p>Fungtastic är ett kosttillskott med fyra kraftfulla medicinska svampar.</p>`,
    ingredients:
      "Chaga, Lion's Mane, Cordyceps, Reishi – ekologiskt odlade, extraherade",
    size: "60 kapslar",
    sizes: ["60 kapslar"],
    guarantee:
      "100% nöjd-kund-garanti. Prova i 14 dagar.",
    vatRate: 0.12,
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getRelatedProducts(id: string, count = 3): Product[] {
  const product = getProduct(id);
  if (!product) return PRODUCTS.slice(0, count);
  return PRODUCTS.filter(
    (p) => p.id !== id && (p.category === product.category || true)
  ).slice(0, count);
}
