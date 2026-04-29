import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const STATIC_EXT =
  /\.(ico|png|jpg|jpeg|webp|avif|svg|gif|txt|xml|json|webmanifest|woff2?|onnx|onnx\.data|bin|pb|data|mp4|webm|mov|m4v|ogv|ogg|mp3|wav|pdf|map|css|js)$/i;

/* ── Shopify legacy redirects ── */
const SHOPIFY_PRODUCT_SLUGS: Record<string, string> = {
  "duo-kit-the-one-i-love": "duo-kit",
  "duo-ta-da": "duo-ta-da",
  "the-one-facial-oil": "duo-ta-da",
  "i-love-facial-oil": "duo-ta-da",
  "ta-da-serum": "ta-da-serum",
  "ta-da-moisturizing-serum": "ta-da-serum",
  "duo-kit": "duo-kit",
  "makeup-remover-au-naturel": "au-naturel-makeup-remover",
  "au-naturel-makeup-remover": "au-naturel-makeup-remover",
  "au-naturel": "au-naturel-makeup-remover",
  "fungtastic-extract": "fungtastic-mushroom-extract",
  "fungtastic-mushroom-extract": "fungtastic-mushroom-extract",
  "fungtastic": "fungtastic-mushroom-extract",
  "akne-paketet": "duo-ta-da",
  "balans-paketet": "duo-ta-da",
  "eksem-paketet": "duo-ta-da",
  "fina-linjer-paketet": "duo-ta-da",
  "kanslig-paketet": "duo-ta-da",
  "rosacea-paketet": "duo-ta-da",
};

const SHOPIFY_COLLECTION_SLUGS: Record<string, string> = {
  kosttillskott: "/sv/produkter/fungtastic-mushroom-extract",
};

const SHOPIFY_BLOG_SLUGS: Record<string, string> = {
  "10-fordelar-med-vatten-for-en-stralande-hud-hur-mycket-borde-du-dricka-per-dag": "/sv/guide/torr-hud-behandling",
  "10-fordelarna-med-cbd-olja-for-hudvard": "/sv/guide/cbd-hudvard",
  "10-tips-akne": "/sv/guide/akne-behandling",
  "10-tips-eksem": "/sv/guide/eksem-behandling",
  "10-tips-torr-hud": "/sv/guide/torr-hud-behandling",
  "10-tips-vid-inflammerad-hud": "/sv/guide/inflammation-i-huden",
  "10-tips-vid-perioral-dermatit": "/sv/guide/hudbarriar-aterstalla",
  "13-biohacks-for-en-stralande-hud": "/sv/guide/stress-hud",
  "1-9-miljoner-ar-av-evolution": "/sv/guide/hudens-mikrobiom",
  "5-nycklar": "/sv/guide/hudbarriar-aterstalla",
  "5-satt-att-starka-ditt-endocannabinoidsystem-ecs": "/sv/guide/endocannabinoidsystemet-i-huden",
  "ai-hudvard": "/sv/gratis-hudanalys",
  "alkoholkonsumtion": "/sv/guide/alkoholvanor-hud",
  "allt-om-huden": "/sv/guide/hudens-mikrobiom",
  "allt-om-rosacea": "/sv/guide/rosacea-behandling",
  "andning-hudvard": "/sv/guide/stress-hud",
  "anvand-inte-solskydd": "/sv/guide/solskydd-och-hudvard",
  "aquaporin-hud-fuktbalans": "/sv/guide/torr-hud-behandling",
  "basta-hudvardsrutinen": "/sv/guide/minimalistisk-hudvard",
  biohack: "/sv/guide/stress-hud",
  "cannabis-sativa-en-fantastisk-vaxt-for-huden": "/sv/guide/cbd-hudvard",
  "cannabis-sativa-hud-hampfroolja-cbd": "/sv/guide/cbd-hudvard",
  "cannabis-vs-marijuana-vs-hampa": "/sv/guide/vad-ar-cbd-olja",
  "cannabinoider-utan-cannabis-ecs-kryddhyllan": "/sv/guide/endocannabinoidsystemet-i-huden",
  "cbd-och-dess-paverkan-pa-keratinocyterna": "/sv/guide/cbd-for-huden",
  "cbd-olja-hudvard-fakta-fordelar": "/sv/guide/cbd-hudvard",
  "cbd-olja-olagligt": "/sv/guide/vad-ar-cbd-olja",
  "cbg-hudvard": "/sv/guide/cbg-hudvard",
  "chaga-svamp": "/sv/guide/chaga-svamp-huden",
  "dina-basta-vanner-och-fiender-pa-huden-mikrober": "/sv/guide/hudens-mikrobiom",
  "dina-gener-avslojar-sanningen-om-huden": "/sv/guide/hudens-mikrobiom",
  "detta-ar-vart-plikt": "/sv/om-oss",
  "egen-hudvard": "/sv/guide/minimalistisk-hudvard",
  "en-fordjupning-inom-akne": "/sv/guide/akne-behandling",
  "endocannabinoidsystemet-ecs-ar-modern-till-kroppens-och-hudens-mikrobiom": "/sv/guide/endocannabinoidsystemet-i-huden",
  "endocannabinoidsystemet-hudens-hemliga-dirigent": "/sv/guide/endocannabinoidsystemet-i-huden",
  "endocannabinoidsystemets-historia-hud": "/sv/guide/endocannabinoidsystemet-i-huden",
  "ett-inlagg-hudvards-och-lakemedelsindustrin-inte-vill-att-du-ska-lasa": "/sv/guide/minimalistisk-hudvard",
  "evolution-takes-time-a-very-long-time": "/sv/guide/hudens-mikrobiom",
  "fargers-paverkan-huden": "/sv/guide/oxidativ-stress-hud",
  "felet-med-solskydd-och-varfor-det-inte-finns-olika-manniskoraser": "/sv/guide/solskydd-och-hudvard",
  "flera-olika-manniskoarter": "/sv/guide/hudens-mikrobiom",
  "fukt-denna-eviga-fraga-om-fukt": "/sv/guide/torr-hud-behandling",
  "hayflick-gransen-och-hudvard": "/sv/guide/anti-aging-hudvard",
  "hayflick-limit": "/sv/guide/anti-aging-hudvard",
  "hampa-en-mangsidig-vaxt-genom-historien": "/sv/guide/vad-ar-cbd-olja",
  "historian-bakom-vart-fantastiska-endocannabinoid-system": "/sv/guide/endocannabinoidsystemet-i-huden",
  "holistisk-guide-eksem-10-tips": "/sv/guide/eksem-behandling",
  "holistisk-guide-rosacea-10-tips": "/sv/guide/rosacea-behandling",
  "holistisk-guide-torr-hud-10-tips": "/sv/guide/torr-hud-behandling",
  "homo-sapiens-hud": "/sv/guide/hudens-mikrobiom",
  "hud-och-kost": "/sv/guide/kost-och-huden",
  "huden-inget-smink": "/sv/guide/minimalistisk-hudvard",
  "huden-psykologi": "/sv/guide/stress-hud",
  "huden-som-ett-ekosystem-varfor-balans-ar-viktigare-an-perfektion": "/sv/guide/hudens-mikrobiom",
  "huden-storsta-organ": "/sv/guide/hudens-mikrobiom",
  "hudens-helhet-evolution-mikrobiom-ecs": "/sv/guide/hudens-mikrobiom",
  "hudens-mikrobiom-bakterier-dysbios": "/sv/guide/hudens-mikrobiom",
  "hudens-mikroflora": "/sv/guide/hudens-mikrobiom",
  "hudens-ph-syramantel": "/sv/guide/hudbarriar-aterstalla",
  "hudens-varningssystem": "/sv/guide/hudbarriar-aterstalla",
  "hudvard-for-man": "/sv/guide/hudvard-for-man",
  "hudvard-sjalvvard": "/sv/guide/minimalistisk-hudvard",
  "hudvardens-historia-mellan-illusion-och-verklighet": "/sv/guide/minimalistisk-hudvard",
  "hudvardens-utveckling": "/sv/guide/minimalistisk-hudvard",
  "hudvardsindustrin-en-bransch-som-knappt-behovs": "/sv/guide/minimalistisk-hudvard",
  "hudvardsindustrin-en-patogen-under-cover": "/sv/guide/minimalistisk-hudvard",
  "hyaluronsyra-hud-fuktbalans": "/sv/guide/cbd-vs-hyaluronsyra",
  "hyperpigmentering-och-endocannabinoidsystemet": "/sv/guide/cbd-mot-pigmentflackar",
  "inflammation-hud": "/sv/guide/inflammation-i-huden",
  "inflammationer-i-huden-en-mardrom-for-anti-age": "/sv/guide/inflammation-i-huden",
  "k-beauty-for-och-emot": "/sv/guide/minimalistisk-hudvard",
  "kalldusch-huden": "/sv/guide/stress-hud",
  "kbeauty-perfekt-hud": "/sv/guide/minimalistisk-hudvard",
  "kosmisk-hudvard": "/sv/guide/minimalistisk-hudvard",
  "kostnadsfri-e-bok-om-allt-du-behover-veta-om-huden": "/sv/guide",
  "lansera-egen-hudvardsprodukt": "/sv/om-oss",
  "lat-oss-prata-miljopaverkan": "/sv/om-oss",
  "lions-mane": "/sv/guide/lions-mane-hud",
  luftfuktare: "/sv/guide/torr-hud-behandling",
  "mantle-hudvard": "/sv/guide/cbd-hudvard",
  "medicinska-svampar-ar-en-game-changer-for-huden": "/sv/guide/reishi-for-huden",
  "motverka-torr-hud": "/sv/guide/torr-hud-behandling",
  "olika-hudtyper": "/sv/guide/minimalistisk-hudvard",
  "ordlexikon-i-den-nya-hudvardsvarlden": "/sv/guide",
  "our-amazing-ecs": "/sv/guide/endocannabinoidsystemet-i-huden",
  "perfekta-hudvardsrutinen": "/sv/guide/minimalistisk-hudvard",
  "ph-varde-huden": "/sv/guide/hudbarriar-aterstalla",
  "reishi-lions-mane-cordyceps-chaga": "/sv/guide/reishi-for-huden",
  "skillnad-hud-man-kvinnor": "/sv/guide/hudvard-for-man",
  "skog-vs-vetefalt-en-berattelse-om-huden": "/sv/guide/hudens-mikrobiom",
  "skogsbad-huden": "/sv/guide/stress-hud",
  "skratt-for-huden": "/sv/guide/stress-hud",
  "snigelslem-hudvard": "/sv/guide/minimalistisk-hudvard",
  "snigelslem-och-bisarra-hudvardsingredienser": "/sv/guide/minimalistisk-hudvard",
  "solskydd-d-vitamin-hudfarg-inga-raser": "/sv/guide/solskydd-och-hudvard",
  "stress-eksem": "/sv/guide/stress-hud",
  "svett-superkraft": "/sv/guide/narmiljo-svett",
  "systemkollaps-hudvardsindustrin": "/sv/guide/minimalistisk-hudvard",
  "tarm-hud-axeln-stress-endocannabinoider": "/sv/guide/tarm-hud-axeln",
  "tewl-nej-tack": "/sv/guide/hudbarriar-aterstalla",
  "the-refeer-madness": "/sv/guide/vad-ar-cbd-olja",
  "tiden-det-tagit-for-hudvardsindustrin-att-forstora-manniskans-hud": "/sv/guide/minimalistisk-hudvard",
  "tobak-hudvard-och-isbrytare-vad-har-dessa-tre-branscher-gemensamt": "/sv/guide/oxidativ-stress-hud",
  "tobak-och-huden": "/sv/guide/oxidativ-stress-hud",
  "torr-hud-fuktbalans": "/sv/guide/torr-hud-behandling",
  "upptackten-av-kroppens-inre-natverk-en-resa-genom-endocannabinoidsystemet": "/sv/guide/endocannabinoidsystemet-i-huden",
  "utmaningar-med-cannabisbranschen": "/sv/guide/vad-ar-cbd-olja",
  "vad-ar-ansiktsolja": "/sv/guide/cbd-ansiktsolja",
  "vad-ar-cbc": "/sv/guide/cbd-hudvard",
  "vad-ar-cbd": "/sv/guide/vad-ar-cbd-olja",
  "vad-ar-cbg": "/sv/guide/vad-ar-cbg",
  "vad-ar-kollagen": "/sv/guide/kollagen-sanning",
  "vad-ar-prebiotisk-hudvard": "/sv/guide/probiotika-hud",
  "vad-ar-probiotisk-hudvard": "/sv/guide/probiotika-hud",
  "vad-har-vi-lart-oss-av-bekampningsmedlet-ddt": "/sv/guide/hudens-mikrobiom",
  "vargarna-i-yellonstone-park": "/sv/guide/hudens-mikrobiom",
  "varfor-cbd-hudvard-inte-funkar": "/sv/guide/cbd-hudvard",
  "varning-enbart-for-dig-som-ar-en-hudvardsnord": "/sv/guide/hudens-mikrobiom",
  "vart-otroliga-sebum": "/sv/guide/sebum-biologi",
  "vart-svett-en-viktig-biologisk-funktion": "/sv/guide/narmiljo-svett",
  "yellowstone-vargar-hud-ekosystem": "/sv/guide/hudens-mikrobiom",
};

function handleShopifyRedirect(pathname: string, request: NextRequest): NextResponse | null {
  const lower = pathname.toLowerCase();

  // /products/:handle → /sv/produkter/:id
  const productMatch = lower.match(/^\/products\/(.+?)(?:\/|$)/);
  if (productMatch) {
    const handle = productMatch[1];
    const mapped = SHOPIFY_PRODUCT_SLUGS[handle] || handle;
    return NextResponse.redirect(new URL(`/sv/produkter/${mapped}`, request.url), 301);
  }

  // /collections/* → /sv/produkter
  const collectionMatch = lower.match(/^\/collections\/([^/?#]+)(?:\/|$)/);
  if (collectionMatch) {
    const destination = SHOPIFY_COLLECTION_SLUGS[collectionMatch[1]] || "/sv/produkter";
    return NextResponse.redirect(new URL(destination, request.url), 301);
  }
  if (lower.startsWith("/collections")) {
    return NextResponse.redirect(new URL("/sv/produkter", request.url), 301);
  }

  // /pages/about, /pages/about-us → /sv/om-oss
  if (lower.startsWith("/pages/about")) {
    return NextResponse.redirect(new URL("/sv/om-oss", request.url), 301);
  }

  // /pages/contact → /sv/kontakt
  if (lower.startsWith("/pages/contact")) {
    return NextResponse.redirect(new URL("/sv/kontakt", request.url), 301);
  }

  // /account → /sv/logga-in
  if (lower === "/account" || lower === "/account/login" || lower === "/account/register") {
    return NextResponse.redirect(new URL("/sv/logga-in", request.url), 301);
  }

  // /cart → /sv/produkter (no cart page, send to shop)
  if (lower === "/cart") {
    return NextResponse.redirect(new URL("/sv/produkter", request.url), 301);
  }

  // /blogs/news/:slug → closest current guide/product page.
  const blogMatch = lower.match(/^\/blogs\/news\/([^/?#]+)(?:\/|$)/);
  if (blogMatch) {
    const destination = SHOPIFY_BLOG_SLUGS[blogMatch[1]] || "/sv/guide";
    return NextResponse.redirect(new URL(destination, request.url), 301);
  }

  // /blogs/* → /sv/guide (guide hub)
  if (lower.startsWith("/blogs")) {
    return NextResponse.redirect(new URL("/sv/guide", request.url), 301);
  }

  return null;
}

function rewriteEnPretty(pathname: string, request: NextRequest): NextResponse | null {
  const url = request.nextUrl.clone();

  if (pathname === "/en/products" || pathname === "/en/products/") {
    url.pathname = "/en/produkter";
    return NextResponse.rewrite(url);
  }
  const prod = pathname.match(/^\/en\/products\/(.+)$/);
  if (prod) {
    url.pathname = `/en/produkter/${prod[1]}`;
    return NextResponse.rewrite(url);
  }

  const map: [string, string][] = [
    ["/en/about", "/en/om-oss"],
    ["/en/contact", "/en/kontakt"],
    ["/en/checkout", "/en/kassa"],
    ["/en/skin-analysis", "/en/hudanalys"],
    ["/en/terms", "/en/villkor"],
    ["/en/privacy", "/en/integritetspolicy"],
    ["/en/login", "/en/logga-in"],
    ["/en/register", "/en/registrera"],
    ["/en/my-account", "/en/mitt-konto"],
    ["/en/write-review", "/en/skriv-omdome"],
    ["/en/payment/success", "/en/betalning/lyckad"],
    ["/en/payment/failed", "/en/betalning/misslyckad"],
    ["/en/loyalty", "/en/lojalitetsprogram"],
    ["/en/set-password", "/en/valj-losenord"],
    ["/en/free-skin-analysis", "/en/gratis-hudanalys"],
  ];

  for (const [from, to] of map) {
    if (pathname === from || pathname === `${from}/`) {
      url.pathname = to;
      return NextResponse.rewrite(url);
    }
  }

  return null;
}

const ES_REWRITE_MAP: [string, string][] = [
  ["/es/productos", "/es/produkter"],
  ["/es/sobre-nosotros", "/es/om-oss"],
  ["/es/contacto", "/es/kontakt"],
  ["/es/pagar", "/es/kassa"],
  ["/es/analisis-piel", "/es/hudanalys"],
  ["/es/terminos", "/es/villkor"],
  ["/es/privacidad", "/es/integritetspolicy"],
  ["/es/iniciar-sesion", "/es/logga-in"],
  ["/es/registro", "/es/registrera"],
  ["/es/mi-cuenta", "/es/mitt-konto"],
  ["/es/escribir-resena", "/es/skriv-omdome"],
  ["/es/pago/exitoso", "/es/betalning/lyckad"],
  ["/es/pago/fallido", "/es/betalning/misslyckad"],
  ["/es/fidelidad", "/es/lojalitetsprogram"],
  ["/es/establecer-contrasena", "/es/valj-losenord"],
  ["/es/analisis-piel-gratis", "/es/gratis-hudanalys"],
];

const FR_REWRITE_MAP: [string, string][] = [
  ["/fr/produits", "/fr/produkter"],
  ["/fr/a-propos", "/fr/om-oss"],
  ["/fr/contact", "/fr/kontakt"],
  ["/fr/paiement", "/fr/kassa"],
  ["/fr/analyse-peau", "/fr/hudanalys"],
  ["/fr/cgv", "/fr/villkor"],
  ["/fr/confidentialite", "/fr/integritetspolicy"],
  ["/fr/connexion", "/fr/logga-in"],
  ["/fr/inscription", "/fr/registrera"],
  ["/fr/mon-compte", "/fr/mitt-konto"],
  ["/fr/ecrire-avis", "/fr/skriv-omdome"],
  ["/fr/paiement/reussi", "/fr/betalning/lyckad"],
  ["/fr/paiement/echoue", "/fr/betalning/misslyckad"],
  ["/fr/fidelite", "/fr/lojalitetsprogram"],
  ["/fr/choisir-mot-de-passe", "/fr/valj-losenord"],
  ["/fr/analyse-de-peau-gratuite", "/fr/gratis-hudanalys"],
];

const DE_REWRITE_MAP: [string, string][] = [
  ["/de/produkte", "/de/produkter"],
  ["/de/ueber-uns", "/de/om-oss"],
  ["/de/kontakt", "/de/kontakt"],
  ["/de/kasse", "/de/kassa"],
  ["/de/hautanalyse", "/de/hudanalys"],
  ["/de/agb", "/de/villkor"],
  ["/de/datenschutz", "/de/integritetspolicy"],
  ["/de/anmelden", "/de/logga-in"],
  ["/de/registrieren", "/de/registrera"],
  ["/de/mein-konto", "/de/mitt-konto"],
  ["/de/bewertung-schreiben", "/de/skriv-omdome"],
  ["/de/zahlung/erfolgreich", "/de/betalning/lyckad"],
  ["/de/zahlung/fehlgeschlagen", "/de/betalning/misslyckad"],
  ["/de/treueprogramm", "/de/lojalitetsprogram"],
  ["/de/passwort-setzen", "/de/valj-losenord"],
  ["/de/kostenlose-hautanalyse", "/de/gratis-hudanalys"],
];

function rewritePretty(
  pathname: string,
  request: NextRequest,
  prefix: string,
  map: [string, string][]
): NextResponse | null {
  const url = request.nextUrl.clone();

  // product list: /es/productos → /es/produkter
  if (pathname === `${prefix}/${map[0][0].split("/")[2]}` || pathname === `${prefix}/${map[0][0].split("/")[2]}/`) {
    url.pathname = `${prefix}/produkter`;
    return NextResponse.rewrite(url);
  }
  // product detail: /es/productos/:id → /es/produkter/:id
  const prodSegment = map[0][0].split("/")[2];
  const prodMatch = pathname.match(new RegExp(`^${prefix}/${prodSegment}/(.+)$`));
  if (prodMatch) {
    url.pathname = `${prefix}/produkter/${prodMatch[1]}`;
    return NextResponse.rewrite(url);
  }

  for (const [from, to] of map) {
    if (pathname === from || pathname === `${from}/`) {
      url.pathname = to;
      return NextResponse.rewrite(url);
    }
  }
  return null;
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  if (host.includes("1753skincare.com")) {
    const dest = new URL(request.url);
    dest.host = "www.1753skin.com";
    dest.port = "";
    return NextResponse.redirect(dest, 301);
  }

  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    STATIC_EXT.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Shopify legacy URLs → 301 redirect
  const shopify = handleShopifyRedirect(pathname, request);
  if (shopify) return shopify;

  const rw = rewriteEnPretty(pathname, request);
  if (rw) return rw;

  const esRw = rewritePretty(pathname, request, "/es", ES_REWRITE_MAP);
  if (esRw) return esRw;

  const deRw = rewritePretty(pathname, request, "/de", DE_REWRITE_MAP);
  if (deRw) return deRw;

  const frRw = rewritePretty(pathname, request, "/fr", FR_REWRITE_MAP);
  if (frRw) return frRw;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/sv", request.url), 301);
  }

  if (
    !pathname.startsWith("/sv") &&
    !pathname.startsWith("/en") &&
    !pathname.startsWith("/es") &&
    !pathname.startsWith("/de") &&
    !pathname.startsWith("/fr")
  ) {
    return NextResponse.redirect(new URL(`/sv${pathname}`, request.url), 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
