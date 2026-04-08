"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Leaf,
  Play,
  Shield,
  Sparkles,
  Star,
  Truck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { SectionWrapper } from "@/components/section-wrapper";
import { PRODUCTS } from "@/lib/products";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Leaf,
    title: "Naturliga ingredienser",
    desc: "CBD och CBG från ekologiskt odlad hampa, utan syntetiska tillsatser.",
    detail:
      "Alla våra produkter bygger på cannabinoider från ekologiskt odlad hampa -- CBD (cannabidiol) och CBG (cannabigerol). Dessa ämnen samverkar med hudens eget endocannabinoidsystem för att reglera inflammation, talgproduktion och cellförnyelse. Vi använder inga syntetiska doftämnen, parabener, silikoner eller mineraloljor. Varje ingrediens har en tydlig funktion: antingen stärker den hudens barriär, ger näring eller lugnar irritation. Inget mer, inget mindre.",
  },
  {
    icon: Shield,
    title: "14 dagars öppet köp",
    desc: "Prova i 14 dagar. Inte nöjd? Pengarna tillbaka, inga frågor.",
    detail:
      "Vi vet att det kan kännas osäkert att testa något nytt. Därför erbjuder vi 14 dagars öppet köp på alla produkter. Om du inte märker skillnad, eller helt enkelt inte är nöjd, skickar du tillbaka produkten och får full återbetalning -- utan krångel, utan frågor. Det här är inget finstilt. Det är vårt löfte: vi tror så mycket på det vi gör att risken ligger hos oss, inte hos dig.",
  },
  {
    icon: Droplets,
    title: "Djup återfuktning",
    desc: "Cannabinoider stärker hudens barriär och binder fukt på djupet.",
    detail:
      "Ytlig fukt avdunstar. Verklig återfuktning handlar om att stärka hudens egen barriär så att fukten stannar kvar. CBD och CBG arbetar på receptornivå med hudens endocannabinoidsystem och hjälper till att reglera transepidermalt vattenförlust (TEWL). I kombination med naturliga oljor och hyaluronsyra skapar våra produkter en fuktbalans som håller -- inte bara i timmar, utan dygnet runt. Huden känns mjuk, smidig och återhämtad på ett sätt som går på djupet.",
  },
  {
    icon: Sparkles,
    title: "Synliga resultat",
    desc: "De flesta ser förbättring inom 14 dagar. Över 1 000 nöjda kunder.",
    detail:
      "Det här är inga tomma löften. I vår kundundersökning rapporterade 87% av användarna synlig förbättring av hudens textur och lyster inom 14 dagar. Rödhet och irritation minskar, porer ser mindre ut och huden får en jämnare ton. Över 1 000 kunder har lämnat omdömen med ett snittbetyg på 4.6 av 5. Skillnaden märks inte bara i spegeln -- den märks i hur huden känns.",
  },
];

const TRUST_ITEMS = [
  { icon: Truck, text: "Fri frakt över 700 kr" },
  { icon: Shield, text: "14 dagars öppet köp" },
  { icon: Star, text: "4.6 av 5 i omdömen" },
];

interface ReviewSnippet {
  id: number;
  reviewer_name: string;
  rating: number;
  title: string;
  body: string;
  product_id: string;
}

const PRODUCT_LABELS: Record<string, string> = {
  "duo-kit": "DUO-kit",
  "duo-ta-da": "DUO-kit + TA-DA",
  "ta-da-serum": "TA-DA Serum",
  "au-naturel-makeup-remover": "Au Naturel",
  "fungtastic-mushroom-extract": "Fungtastic",
};

function ReviewCarousel() {
  const [reviews, setReviews] = useState<ReviewSnippet[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const productIds = ["duo-kit", "duo-ta-da", "ta-da-serum", "au-naturel-makeup-remover", "fungtastic-mushroom-extract"];
    Promise.all(
      productIds.map(id =>
        apiFetch<{ reviews: ReviewSnippet[] }>(`/reviews/${id}?limit=10&offset=0`)
          .then(d => d.reviews.filter(r => r.rating === 5 && r.body.length > 30))
          .catch(() => [] as ReviewSnippet[])
      )
    ).then(results => {
      const all = results.flat();
      for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
      }
      setReviews(all.slice(0, 20));
    });
  }, []);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  }, [reviews, checkScroll]);

  function scroll(dir: "left" | "right") {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
  }

  if (reviews.length === 0) return null;

  return (
    <section className="py-6 md:py-10">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-2 text-sm font-semibold text-brand-900">4.6</span>
              <span className="text-sm text-brand-400">baserat på 919 omdömen</span>
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-brand-900 md:text-3xl">
              Vad våra kunder säger
            </h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-200 text-brand-500 transition-all hover:border-brand-400 hover:bg-brand-50 disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-200 text-brand-500 transition-all hover:border-brand-400 hover:bg-brand-50 disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-2 md:px-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ paddingLeft: "max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))" }}
      >
        {reviews.map((r) => (
          <div
            key={r.id}
            className="w-[300px] flex-shrink-0 snap-start rounded-2xl border border-brand-100 bg-white p-5 transition-all duration-300 hover:shadow-lg hover:shadow-brand-900/5"
          >
            <div className="mb-3 flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            {r.title && (
              <h4 className="mb-1.5 text-[14px] font-semibold text-brand-900 line-clamp-1">{r.title}</h4>
            )}
            <p className="text-[13px] leading-relaxed text-brand-600 line-clamp-4">
              {r.body}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] font-medium text-brand-500">{r.reviewer_name}</span>
              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[10px] font-medium text-brand-400">
                {PRODUCT_LABELS[r.product_id] || r.product_id}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function VideoEmbed() {
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data.event === "ended") {
          setPlaying(false);
        }
      } catch {}
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-brand-50 shadow-2xl shadow-brand-900/10 ring-1 ring-brand-100 md:aspect-[4/5]">
      {playing && (
        <iframe
          ref={iframeRef}
          src="https://player.vimeo.com/video/1179523141?autoplay=1&title=0&byline=0&portrait=0&api=1"
          className="absolute inset-0 z-10 h-full w-full"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      )}

      <button
        onClick={() => setPlaying(true)}
        className={cn(
          "group absolute inset-0 flex cursor-pointer items-center justify-center transition-opacity duration-500",
          playing ? "pointer-events-none opacity-0" : "opacity-100"
        )}
        aria-label="Spela video"
      >
        <Image
          src="/video-poster.jpg"
          alt="1753 SKINCARE video"
          fill
          priority
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        <div className="absolute inset-0 bg-brand-900/10 transition-colors duration-300 group-hover:bg-brand-900/20" />
        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5" />

        <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-xl shadow-brand-900/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl md:h-20 md:w-20">
          <Play className="ml-1 h-6 w-6 fill-brand-900 text-brand-900 md:h-7 md:w-7" />
        </div>
      </button>
    </div>
  );
}

function FeatureModal({
  feature,
  onClose,
}: {
  feature: (typeof FEATURES)[number] | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!feature) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [feature, onClose]);

  if (!feature) return null;

  const Icon = feature.icon;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-brand-900/40 backdrop-blur-sm animate-in fade-in duration-200" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg animate-in zoom-in-95 fade-in slide-in-from-bottom-4 duration-300 rounded-3xl bg-white p-8 shadow-2xl shadow-brand-900/20 ring-1 ring-brand-100 md:p-10"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-brand-400 transition-colors hover:bg-brand-50 hover:text-brand-700"
          aria-label="Stang"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 ring-1 ring-brand-100">
          <Icon className="h-6 w-6 text-brand-700" />
        </div>

        <h3 className="mb-3 text-xl font-bold tracking-tight text-brand-900">
          {feature.title}
        </h3>

        <p className="text-[15px] leading-relaxed text-brand-500">
          {feature.detail}
        </p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState<(typeof FEATURES)[number] | null>(null);

  const closeFeature = useCallback(() => setActiveFeature(null), []);

  return (
    <>
      <FeatureModal feature={activeFeature} onClose={closeFeature} />

      {/* Hero */}
      <section className="py-10 md:py-16 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          <div className="flex flex-col-reverse items-center gap-10 md:flex-row md:gap-16 lg:gap-20">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-brand-900 md:text-5xl lg:text-6xl">
                Känn dig
                <br />
                som du
              </h1>
              <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-brand-500 md:mx-0 md:text-lg">
                Utan filter. Utan ursäkt.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4 md:justify-start">
                <Link href="/#produkter">
                  <Button size="lg" pulse>
                    Se produkter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 md:justify-start">
                {TRUST_ITEMS.map((t) => (
                  <div
                    key={t.text}
                    className="flex items-center gap-1.5 text-[12px] font-medium text-brand-500"
                  >
                    <t.icon className="h-3.5 w-3.5" />
                    <span>{t.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full max-w-xs flex-shrink-0 md:max-w-sm lg:max-w-md">
              <VideoEmbed />
            </div>
          </div>
        </div>
      </section>

      {/* Review carousel */}
      <ReviewCarousel />

      {/* Products (moved above features) */}
      <SectionWrapper className="!py-10 md:!py-14">
        <div id="produkter" className="-mt-20 pt-20" />
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-brand-900">
            Vårt sortiment
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-brand-500">
            Varje produkt är utvecklad för att stärka din hud inifrån.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {PRODUCTS.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 2} />
          ))}
        </div>
      </SectionWrapper>

      {/* Features */}
      <SectionWrapper alt>
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-brand-900">
            Varför 1753?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-brand-500">
            Vi tror på färre produkter, bättre ingredienser och ärlig hudvård.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <button
              key={f.title}
              onClick={() => setActiveFeature(f)}
              className="group cursor-pointer rounded-2xl bg-white p-6 text-left shadow-sm ring-1 ring-brand-100/60 transition-all duration-300 hover:shadow-lg hover:shadow-brand-900/5 hover:scale-[1.02]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 ring-1 ring-brand-100 transition-colors group-hover:bg-green/10 group-hover:ring-green/20">
                <f.icon className="h-5 w-5 text-brand-700 transition-colors group-hover:text-green" />
              </div>
              <h3 className="mb-1.5 text-sm font-bold tracking-tight text-brand-900">
                {f.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-brand-500">
                {f.desc}
              </p>
              <span className="mt-3 inline-block text-[12px] font-medium text-green opacity-0 transition-opacity group-hover:opacity-100">
                Las mer
              </span>
            </button>
          ))}
        </div>
      </SectionWrapper>

      {/* Skin analysis CTA */}
      <SectionWrapper alt>
        <div className="relative overflow-hidden rounded-3xl bg-brand-900 px-8 py-16 text-center shadow-xl md:px-16 md:py-20">
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full border border-white/5 animate-float" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full border border-white/5 animate-float [animation-delay:2s]" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Osäker på vad din hud behöver?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-brand-300">
              Vår AI-drivna hudanalys ger dig personliga rekommendationer
              baserade på din unika hudtyp. Helt gratis, helt anonymt.
            </p>
            <div className="mt-10">
              <Link href="/hudanalys">
                <Button
                  size="lg"
                  className="bg-white text-brand-900 shadow-lg hover:bg-brand-50 hover:shadow-xl"
                >
                  Starta hudanalys
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
