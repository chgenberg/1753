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

// Alla mål-URL:er har verifierats mot ALL_LANDING_PAGES (lib/seo/pages-*.ts).
// Tidigare versioner pekade på guides som inte fanns (endocannabinoidsystemet-i-huden,
// hudens-mikrobiom, hudbarriar-aterstalla m.fl.) → 404 → "Verifieringen misslyckades"
// i Google Search Console. Dessa har nu mappats om till närmsta giltiga guide.
const SHOPIFY_BLOG_SLUGS: Record<string, string> = {
  "10-fordelar-med-vatten-for-en-stralande-hud-hur-mycket-borde-du-dricka-per-dag": "/sv/guide/torr-hud-behandling",
  "10-fordelarna-med-cbd-olja-for-hudvard": "/sv/guide/cbd-hudvard",
  "10-tips-akne": "/sv/guide/akne-behandling",
  "10-tips-eksem": "/sv/guide/eksem-behandling",
  "10-tips-kanslig-hud": "/sv/guide/kanslig-hud-behandling",
  "10-tips-torr-hud": "/sv/guide/torr-hud-behandling",
  "10-tips-vid-inflammerad-hud": "/sv/guide/cbg-mot-inflammation",
  "10-tips-vid-perioral-dermatit": "/sv/guide/kanslig-hud-behandling",
  "10-tips-vid-rosacea": "/sv/guide/cbd-mot-rosacea",
  "13-biohacks-for-en-stralande-hud": "/sv/guide/stress-och-huden",
  "1-9-miljoner-ar-av-evolution": "/sv/guide/tarmhalsa-och-huden",
  "4health-medicinsvampar-med-christopher-anna-sparre": "/sv/guide/hampa-hudvard",
  "5-nycklar": "/sv/guide/kanslig-hud-behandling",
  "5-satt-att-starka-ditt-endocannabinoidsystem-ecs": "/sv/guide/cannabinoid-hudvard",
  "ai-hudvard": "/sv/gratis-hudanalys",
  "alkoholkonsumtion": "/sv/guide/stress-och-huden",
  "allt-om-huden": "/sv/guide/tarmhalsa-och-huden",
  "allt-om-rosacea": "/sv/guide/cbd-mot-rosacea",
  "allt-om-vatten": "/sv/guide/torr-hud-behandling",
  "andning-hudvard": "/sv/guide/stress-och-huden",
  "anvand-inte-solskydd": "/sv/guide/solskydd-och-hudvard",
  "aquaporin-hud-fuktbalans": "/sv/guide/torr-hud-behandling",
  "basta-hudvardsrutinen": "/sv/guide/basta-hudvardsrutin",
  biohack: "/sv/guide/stress-och-huden",
  "cannabis-sativa-en-fantastisk-vaxt-for-huden": "/sv/guide/cbd-hudvard",
  "cannabis-sativa-hud-hampfroolja-cbd": "/sv/guide/cbd-hudvard",
  "cannabis-vs-marijuana-vs-hampa": "/sv/guide/hampa-hudvard",
  "cannabinoider-utan-cannabis-ecs-kryddhyllan": "/sv/guide/cannabinoid-hudvard",
  "cbd-och-cbg-en-revolutionerande-duo-for-hudens-cellfornyelseprocess": "/sv/guide/cbd-vs-cbg",
  "cbd-och-dess-paverkan-pa-keratinocyterna": "/sv/guide/cbd-hudvard",
  "cbd-och-hudens-aldrande": "/sv/guide/cbd-mot-aldrandetecken",
  "cbd-olja-hudvard-fakta-fordelar": "/sv/guide/cbd-hudvard",
  "cbd-olja-olagligt": "/sv/guide/cbd-hudvard",
  "cbg-hudvard": "/sv/guide/cbg-hudvard",
  "chaga-svamp": "/sv/guide/cannabinoid-hudvard",
  "det-ar-har-cannabis-kommer-in": "/sv/guide/cbd-hudvard",
  "dina-basta-vanner-och-fiender-pa-huden-mikrober": "/sv/guide/tarmhalsa-och-huden",
  "dina-gener-avslojar-sanningen-om-huden": "/sv/guide/tarmhalsa-och-huden",
  "detta-ar-vart-plikt": "/sv/om-oss",
  "egen-hudvard": "/sv/guide/basta-hudvardsrutin",
  "en-fordjupning-inom-akne": "/sv/guide/akne-behandling",
  "en-summering-av-den-traditionella-hudvardsindustrin": "/sv/guide/basta-hudvardsrutin",
  "endocannabinoidsystemet-ecs-ar-modern-till-kroppens-och-hudens-mikrobiom": "/sv/guide/cannabinoid-hudvard",
  "endocannabinoidsystemet-hudens-hemliga-dirigent": "/sv/guide/cannabinoid-hudvard",
  "endocannabinoidsystemets-historia-hud": "/sv/guide/cannabinoid-hudvard",
  "ett-inlagg-hudvards-och-lakemedelsindustrin-inte-vill-att-du-ska-lasa": "/sv/guide/basta-hudvardsrutin",
  "evolution-takes-time-a-very-long-time": "/sv/guide/tarmhalsa-och-huden",
  "fargers-paverkan-huden": "/sv/guide/stress-och-huden",
  "felet-med-solskydd-och-varfor-det-inte-finns-olika-manniskoraser": "/sv/guide/solskydd-och-hudvard",
  "flera-olika-manniskoarter": "/sv/guide/tarmhalsa-och-huden",
  "fukt-denna-eviga-fraga-om-fukt": "/sv/guide/torr-hud-behandling",
  "hayflick-gransen-och-hudvard": "/sv/guide/anti-aging-hudvard",
  "hayflick-limit": "/sv/guide/anti-aging-hudvard",
  "hampa-en-mangsidig-vaxt-genom-historien": "/sv/guide/hampa-hudvard",
  "historian-bakom-vart-fantastiska-endocannabinoid-system": "/sv/guide/cannabinoid-hudvard",
  "holistisk-guide-eksem-10-tips": "/sv/guide/eksem-behandling",
  "holistisk-guide-perioral-dermatit-10-tips": "/sv/guide/kanslig-hud-behandling",
  "holistisk-guide-rosacea-10-tips": "/sv/guide/cbd-mot-rosacea",
  "holistisk-guide-torr-hud-10-tips": "/sv/guide/torr-hud-behandling",
  "homo-sapiens-hud": "/sv/guide/tarmhalsa-och-huden",
  "hud-och-kost": "/sv/guide/kost-och-huden",
  "huden-ar-som-en-o-i-vastra-stilla-havet": "/sv/guide/tarmhalsa-och-huden",
  "huden-inget-smink": "/sv/guide/basta-hudvardsrutin",
  "huden-psykologi": "/sv/guide/stress-och-huden",
  "huden-som-ett-ekosystem-varfor-balans-ar-viktigare-an-perfektion": "/sv/guide/tarmhalsa-och-huden",
  "huden-storsta-organ": "/sv/guide/tarmhalsa-och-huden",
  "hudens-helhet-evolution-mikrobiom-ecs": "/sv/guide/tarmhalsa-och-huden",
  "hudens-mikrobiom-bakterier-dysbios": "/sv/guide/tarmhalsa-och-huden",
  "hudens-mikroflora": "/sv/guide/tarmhalsa-och-huden",
  "hudens-ph-syramantel": "/sv/guide/kanslig-hud-behandling",
  "hudens-varningssystem": "/sv/guide/kanslig-hud-behandling",
  "hudvard-for-man": "/sv/guide/hudvard-for-man",
  "hudvard-sjalvvard": "/sv/guide/basta-hudvardsrutin",
  "hudvardens-historia-mellan-illusion-och-verklighet": "/sv/guide/basta-hudvardsrutin",
  "hudvardens-utveckling": "/sv/guide/basta-hudvardsrutin",
  "hudvardsindustrin-en-bransch-som-knappt-behovs": "/sv/guide/basta-hudvardsrutin",
  "hudvardsindustrin-en-patogen-under-cover": "/sv/guide/basta-hudvardsrutin",
  "hyaluronsyra-hud-fuktbalans": "/sv/guide/cbd-ansiktsolja",
  "hyperpigmentering-och-endocannabinoidsystemet": "/sv/guide/cbd-mot-pigmentflackar",
  "inflammation-hud": "/sv/guide/cbg-mot-inflammation",
  "inflammationer-i-huden-en-mardrom-for-anti-age": "/sv/guide/cbg-mot-inflammation",
  "k-beauty-for-och-emot": "/sv/guide/basta-hudvardsrutin",
  "kalldusch-huden": "/sv/guide/stress-och-huden",
  "kbeauty-perfekt-hud": "/sv/guide/basta-hudvardsrutin",
  "kosmisk-hudvard": "/sv/guide/basta-hudvardsrutin",
  "kostnadsfri-e-bok-om-allt-du-behover-veta-om-huden": "/sv/guide",
  "lansera-egen-hudvardsprodukt": "/sv/om-oss",
  "lat-oss-prata-miljopaverkan": "/sv/om-oss",
  "lions-mane": "/sv/guide/cannabinoid-hudvard",
  luftfuktare: "/sv/guide/torr-hud-behandling",
  "mantle-hudvard": "/sv/guide/cbd-hudvard",
  "medicinska-svampar-ar-en-game-changer-for-huden": "/sv/guide/cannabinoid-hudvard",
  "motverka-torr-hud": "/sv/guide/torr-hud-behandling",
  "olika-hudtyper": "/sv/guide/basta-hudvardsrutin",
  "ordlexikon-i-den-nya-hudvardsvarlden": "/sv/guide",
  "our-amazing-ecs": "/sv/guide/cannabinoid-hudvard",
  "perfekta-hudvardsrutinen": "/sv/guide/basta-hudvardsrutin",
  "ph-varde-huden": "/sv/guide/kanslig-hud-behandling",
  "reishi-lions-mane-cordyceps-chaga": "/sv/guide/cannabinoid-hudvard",
  "skillnad-hud-man-kvinnor": "/sv/guide/hudvard-for-man",
  "skin-gut": "/sv/guide/tarmhalsa-och-huden",
  "skog-vs-vetefalt-en-berattelse-om-huden": "/sv/guide/tarmhalsa-och-huden",
  "skogsbad-huden": "/sv/guide/stress-och-huden",
  "skratt-for-huden": "/sv/guide/stress-och-huden",
  "snigelslem-hudvard": "/sv/guide/basta-hudvardsrutin",
  "snigelslem-och-bisarra-hudvardsingredienser": "/sv/guide/basta-hudvardsrutin",
  "solskydd-d-vitamin-hudfarg-inga-raser": "/sv/guide/solskydd-och-hudvard",
  somn: "/sv/guide/somn-och-huden",
  "stress-eksem": "/sv/guide/stress-och-huden",
  "svett-superkraft": "/sv/guide/stress-och-huden",
  "systemkollaps-hudvardsindustrin": "/sv/guide/basta-hudvardsrutin",
  "tagged/endocannabinoid": "/sv/guide/cannabinoid-hudvard",
  "tarm-hud-axeln-stress-endocannabinoider": "/sv/guide/tarmhalsa-och-huden",
  "tewl-nej-tack": "/sv/guide/kanslig-hud-behandling",
  "the-refeer-madness": "/sv/guide/cbd-hudvard",
  "tiden-det-tagit-for-hudvardsindustrin-att-forstora-manniskans-hud": "/sv/guide/basta-hudvardsrutin",
  "tobak-hudvard-och-isbrytare-vad-har-dessa-tre-branscher-gemensamt": "/sv/guide/stress-och-huden",
  "tobak-och-huden": "/sv/guide/stress-och-huden",
  "torr-hud-fuktbalans": "/sv/guide/torr-hud-behandling",
  "upptackten-av-kroppens-inre-natverk-en-resa-genom-endocannabinoidsystemet": "/sv/guide/cannabinoid-hudvard",
  "utmaningar-med-cannabisbranschen": "/sv/guide/cbd-hudvard",
  "vad-ar-ansiktsolja": "/sv/guide/cbd-ansiktsolja",
  "vad-ar-cbc": "/sv/guide/cbd-hudvard",
  "vad-ar-cbd": "/sv/guide/cbd-hudvard",
  "vad-ar-cbd-hudvard": "/sv/guide/cbd-hudvard",
  "vad-ar-cbg": "/sv/guide/cbg-hudvard",
  "vad-ar-endocannabinoider": "/sv/guide/cannabinoid-hudvard",
  "vad-ar-kollagen": "/sv/guide/anti-aging-hudvard",
  "vad-ar-prebiotisk-hudvard": "/sv/guide/tarmhalsa-och-huden",
  "vad-ar-probiotisk-hudvard": "/sv/guide/tarmhalsa-och-huden",
  "vad-har-vi-lart-oss-av-bekampningsmedlet-ddt": "/sv/guide/tarmhalsa-och-huden",
  "vargarna-i-yellonstone-park": "/sv/guide/tarmhalsa-och-huden",
  "varfor-cbd-hudvard-inte-funkar": "/sv/guide/cbd-hudvard",
  "varning-enbart-for-dig-som-ar-en-hudvardsnord": "/sv/guide/tarmhalsa-och-huden",
  "vart-otroliga-sebum": "/sv/guide/cbd-mot-fet-hud",
  "vart-svett-en-viktig-biologisk-funktion": "/sv/guide/stress-och-huden",
  "vem-styr-varlden": "/sv/guide/cannabinoid-hudvard",
  "vitamin-d-cancer": "/sv/guide/solskydd-och-hudvard",
  "yellowstone-vargar-hud-ekosystem": "/sv/guide/tarmhalsa-och-huden",
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
