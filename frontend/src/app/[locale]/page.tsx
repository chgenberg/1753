"use client";

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Leaf,
  Shield,
  Sparkles,
  Star,
  Truck,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { SectionWrapper } from "@/components/section-wrapper";
import { PRODUCTS, getProduct, productDisplayName } from "@/lib/products";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useLocale } from "@/providers/locale-provider";
import { Reveal, Marquee, displayFont } from "@/components/fx/motion";
import { MediaFrame, Pill } from "@/components/fx/frames";

const FEATURE_ICONS: LucideIcon[] = [Leaf, Droplets, Sparkles];

interface ReviewSnippet {
  id: number;
  reviewer_name: string;
  rating: number;
  title: string;
  body: string;
  product_id: string;
}

function ReviewCarousel() {
  const { t, locale } = useLocale();
  const [reviews, setReviews] = useState<ReviewSnippet[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const productIds = ["duo-kit", "duo-ta-da", "ta-da-serum", "au-naturel-makeup-remover", "fungtastic-mushroom-extract"];
    Promise.all(
      productIds.map((id) =>
        apiFetch<{ reviews: ReviewSnippet[] }>(`/reviews/${id}?limit=10&offset=0&locale=${locale}`)
          .then((d) => d.reviews.filter((r) => r.rating === 5 && r.body.length > 30))
          .catch(() => [] as ReviewSnippet[])
      )
    ).then((results) => {
      const all = results.flat();
      for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
      }
      setReviews(all.slice(0, 20));
    });
  }, [locale]);

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

  function productLabel(productId: string) {
    const p = getProduct(productId);
    return p ? productDisplayName(p, locale) : productId;
  }

  if (reviews.length === 0) return null;

  return (
    <section className="py-6 md:py-10">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-2 text-sm font-semibold text-brand-900">{t("home.reviewsRating")}</span>
              <span className="text-sm text-brand-400">{t("home.reviewsBasedOn")}</span>
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-brand-900 md:text-3xl">
              {t("home.reviewsTitle")}
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
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            {r.title && (
              <h4 className="mb-1.5 text-[14px] font-semibold text-brand-900 line-clamp-1">{r.title}</h4>
            )}
            <p className="text-[13px] leading-relaxed text-brand-600 line-clamp-4">{r.body}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] font-medium text-brand-500">{r.reviewer_name}</span>
              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[10px] font-medium text-brand-400">
                {productLabel(r.product_id)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function VideoPopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLocale();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-brand-900/60 backdrop-blur-sm animate-in fade-in duration-200" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl animate-in zoom-in-95 fade-in slide-in-from-bottom-4 duration-300"
      >
        <button
          onClick={onClose}
          className="absolute -right-2 -top-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-brand-700 shadow-lg backdrop-blur-sm transition-colors hover:bg-white"
          aria-label={t("home.closeModalAria")}
        >
          <X className="h-4 w-4" />
        </button>
        <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-2xl shadow-brand-900/30">
          <iframe
            src="https://player.vimeo.com/video/1179523141?autoplay=1&title=0&byline=0&portrait=0&api=1"
            className="h-full w-full"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

function VideoTab({ onClick }: { onClick: () => void }) {
  const { t } = useLocale();
  return (
    <button
      onClick={onClick}
      className="fixed right-0 top-1/2 z-50 -translate-y-1/2 cursor-pointer"
      aria-label={t("home.playVideo")}
    >
      <div className="rounded-l-lg bg-brand-900/90 py-2 pl-1.5 pr-1 shadow-lg shadow-brand-900/20 backdrop-blur-sm transition-all duration-300 hover:bg-brand-900 hover:pl-2 hover:shadow-xl">
        <span className="block whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.12em] text-white [writing-mode:vertical-lr] rotate-180">
          {t("home.watchVideoTab")}
        </span>
      </div>
    </button>
  );
}

type FeatureItem = { icon: LucideIcon; title: string; desc: string; detail: string };

function FeatureModal({ feature, onClose }: { feature: FeatureItem | null; onClose: () => void }) {
  const { t } = useLocale();
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-brand-900/40 backdrop-blur-sm animate-in fade-in duration-200" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg animate-in zoom-in-95 fade-in slide-in-from-bottom-4 duration-300 rounded-3xl bg-white p-8 shadow-2xl shadow-brand-900/20 ring-1 ring-brand-100 md:p-10"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-brand-400 transition-colors hover:bg-brand-50 hover:text-brand-700"
          aria-label={t("home.closeModalAria")}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 ring-1 ring-brand-100">
          <Icon className="h-6 w-6 text-brand-700" />
        </div>

        <h3 className="mb-3 text-xl font-bold tracking-tight text-brand-900">{feature.title}</h3>

        <p className="text-[15px] leading-relaxed text-brand-500">{feature.detail}</p>
      </div>
    </div>
  );
}

/** Färgblockskort + media-rad i demo-designens formspråk. */
function ShowcaseSection({
  title,
  sub,
  href,
  bg,
  heroImg,
  heroAlt,
  detailImg,
  detailShape,
  reverse = false,
}: {
  title: ReactNode;
  sub: string;
  href: string;
  bg: string;
  heroImg: string;
  heroAlt: string;
  detailImg: string;
  detailShape: "arch" | "circle" | "rounded";
  reverse?: boolean;
}) {
  return (
    <section className="mx-auto mt-20 w-full max-w-[1400px] px-4 md:mt-28">
      <Reveal>
        <Link
          href={href}
          className={`block ${bg} rounded-[32px] px-6 py-20 text-center transition-transform duration-700 hover:scale-[1.005] md:py-32`}
        >
          <Pill dark>1753</Pill>
          <h2 className={`${displayFont} mx-auto mt-8 max-w-4xl text-5xl leading-[1.05] tracking-[-0.01em] text-white md:text-7xl`}>
            {title}
          </h2>
          <div className="mx-auto mt-8 h-px w-12 bg-white/40" />
          <p className="mt-7 text-[13px] font-semibold uppercase tracking-[0.22em] text-white/75">
            {sub}
          </p>
        </Link>
      </Reveal>

      <div className={`mt-5 grid grid-cols-1 gap-5 md:grid-cols-3 ${reverse ? "md:[direction:rtl]" : ""}`}>
        <Reveal className="md:col-span-2 md:[direction:ltr]" delay={80}>
          <MediaFrame
            src={heroImg}
            alt={heroAlt}
            shape="wide"
            depth={60}
            sizes="(max-width: 768px) 100vw, 66vw"
            className="aspect-[4/3] md:aspect-[16/10]"
          />
        </Reveal>
        <Reveal className="md:[direction:ltr]" delay={200}>
          <MediaFrame
            src={detailImg}
            alt={heroAlt}
            shape={detailShape}
            depth={40}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="h-full min-h-[320px]"
          />
        </Reveal>
      </div>
    </section>
  );
}

function tx(locale: string, sv: string, en: string, es?: string, de?: string, fr?: string) {
  if (locale === "sv") return sv;
  if (locale === "es") return es || en;
  if (locale === "de") return de || en;
  if (locale === "fr") return fr || en;
  return en;
}

export default function HomePage() {
  const { t, messages, path, homeHash, locale } = useLocale();
  const [activeFeature, setActiveFeature] = useState<FeatureItem | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [showUnsub, setShowUnsub] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("unsubscribed") === "1") {
      setShowUnsub(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const features: FeatureItem[] = messages.home.features.map((f, i) => ({
    ...f,
    icon: FEATURE_ICONS[i] ?? Leaf,
  }));

  const trustItems = [
    { icon: Truck, text: t("home.trust0") },
    { icon: Shield, text: t("home.trust1") },
    { icon: Star, text: t("home.trust2") },
  ];

  const closeFeature = useCallback(() => setActiveFeature(null), []);
  const closeVideo = useCallback(() => setVideoOpen(false), []);

  return (
    <>
      <FeatureModal feature={activeFeature} onClose={closeFeature} />
      <VideoPopup open={videoOpen} onClose={closeVideo} />
      <VideoTab onClick={() => setVideoOpen(true)} />

      {showUnsub && (
        <div className="fixed inset-x-0 top-20 z-50 mx-auto max-w-md animate-fade-in px-4">
          <div className="flex items-center gap-3 rounded-2xl border border-[#e6e6e6] bg-white px-5 py-4 shadow-xl">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#108474]/10">
              <Shield className="h-4 w-4 text-[#108474]" />
            </div>
            <p className="flex-1 text-sm text-[#1d1d1f]">
              {tx(locale,
                "Du har avprenumererats och kommer inte längre att få nyhetsbrev.",
                "You have been unsubscribed and will no longer receive newsletters.",
                "Te has dado de baja y ya no recibirás boletines.",
                "Du wurdest abgemeldet und wirst keine Newsletter mehr erhalten.",
                "Vous avez été désabonné(e) et ne recevrez plus de newsletters.")}
            </p>
            <button onClick={() => setShowUnsub(false)} className="shrink-0 rounded-full p-1 text-[#766a62] transition-colors hover:bg-[#f5f5f7]">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── HERO – tre valvbågsramar i nya formspråket ── */}
      <section className="relative z-[2] -mt-[76px] overflow-hidden rounded-b-[48px] bg-[#f5f5f7] pb-10 shadow-[0_30px_60px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col gap-10 pt-32 md:pt-36">
          <Reveal className="flex flex-col items-center gap-5 px-6 text-center">
            <Pill>1753 Skincare</Pill>
            <h1 className={`${displayFont} text-5xl leading-[1.05] tracking-[-0.01em] text-[#1d1d1f] md:text-7xl`}>
              {t("home.heroLine1")} <em className="text-[#108474] [font-style:italic]">{t("home.heroLine2")}</em>
            </h1>
            <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[#766a62]">
              {t("home.heroSub")}
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
              <Link href={homeHash("#produkter")}>
                <Button size="lg" pulse className="rounded-full">
                  {t("home.ctaProducts")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-5">
              {trustItems.map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-1.5 text-[12px] font-medium text-brand-500"
                >
                  <item.icon className="h-3.5 w-3.5" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-3">
            <Reveal delay={100} className="max-md:hidden">
              <MediaFrame
                src="/New_Products/DUOwoman.jpg"
                alt={t("home.heroImageAlt")}
                shape="arch-bl"
                depth={70}
                priority
                className="h-[64vh] min-h-[420px]"
              />
            </Reveal>
            <Reveal delay={220}>
              <MediaFrame
                src="/Bakgrund_hero_2.jpg"
                alt={t("home.heroImageAlt")}
                shape="arch"
                depth={70}
                priority
                sizes="(max-width: 768px) 100vw, 33vw"
                className="h-[64vh] min-h-[420px] max-md:h-[56vh]"
              />
            </Reveal>
            <Reveal delay={340} className="max-md:hidden">
              <MediaFrame
                src="/New_Products/TheONE.jpg"
                alt={t("home.heroImageAlt")}
                shape="arch-br"
                depth={70}
                priority
                className="h-[64vh] min-h-[420px]"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Resten glider upp under heron – sektionsöverlappet */}
      <div className="relative z-[1] -mt-12 pt-12">
        {/* ── STATEMENT ── */}
        <section className="flex flex-col items-center gap-7 px-6 py-24 text-center md:py-36">
          <Reveal>
            <Pill>1753</Pill>
          </Reveal>
          <Reveal delay={120}>
            <h2 className={`${displayFont} mx-auto max-w-3xl text-4xl leading-[1.15] tracking-[-0.01em] text-[#1d1d1f] md:text-6xl`}>
              {t("home.statement1")}
              <em className="text-[#108474] [font-style:italic]">{t("home.statementAccent")}</em>
              {t("home.statement2")}
            </h2>
          </Reveal>
        </section>

        <SectionWrapper className="!py-6 md:!py-10">
          <div id="produkter" className="-mt-24 pt-24" />
          <Reveal className="mb-12 text-center">
            <h2 className={`${displayFont} text-4xl tracking-[-0.01em] text-brand-900 md:text-5xl`}>{t("home.sortimentTitle")}</h2>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-brand-500">{t("home.sortimentSub")}</p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {PRODUCTS.map((product, i) => (
              <Reveal key={product.id} delay={(i % 4) * 80}>
                <ProductCard product={product} priority={i < 2} />
              </Reveal>
            ))}
          </div>
        </SectionWrapper>

        {/* ── SHOWCASE: DUO-KIT ── */}
        <ShowcaseSection
          title={<>The ONE <em className="[font-style:italic]">+</em> I LOVE</>}
          sub={`DUO-kit – ${t("home.explore")}`}
          href={path("product", { productId: "duo-kit" })}
          bg="bg-[#108474]"
          heroImg="/New_Products/DUO+TA-DAWoman.jpg"
          heroAlt="DUO-kit"
          detailImg="/New_Products/DUO.jpg"
          detailShape="arch"
        />

        {/* ── SHOWCASE: TA-DA SERUM ── */}
        <ShowcaseSection
          title={<>TA-DA <em className="[font-style:italic]">Serum</em></>}
          sub={`CBD & CBG – ${t("home.explore")}`}
          href={path("product", { productId: "ta-da-serum" })}
          bg="bg-[#766a62]"
          heroImg="/New_Products/TA-DAWoman.jpg"
          heroAlt="TA-DA Serum"
          detailImg="/New_Products/TA-DA.jpg"
          detailShape="circle"
          reverse
        />

        {/* ── MARQUEE ── */}
        <Marquee
          items={["CBD", "CBG", "MCT", "Jojoba", "Chaga", "Lion's Mane", "Cordyceps", "Reishi"]}
          className={`${displayFont} mt-20 py-2 text-3xl text-[#766a62]/60 [font-style:italic] md:mt-28 md:text-5xl`}
        />

        {/* ── SHOWCASE: FUNGTASTIC ── */}
        <ShowcaseSection
          title={<>Fungtastic <em className="[font-style:italic]">Mushroom</em></>}
          sub={`Chaga · Lion's Mane · Cordyceps · Reishi – ${t("home.explore")}`}
          href={path("product", { productId: "fungtastic-mushroom-extract" })}
          bg="bg-[#1d1d1f]"
          heroImg="/New_Products/Fungtasticwoman.jpg"
          heroAlt="Fungtastic Mushroom Extract"
          detailImg="/New_Products/Fungtastic.jpg"
          detailShape="rounded"
        />

        <div className="mt-12">
          <ReviewCarousel />
        </div>

        <SectionWrapper alt>
          <Reveal className="mb-12 text-center">
            <h2 className={`${displayFont} text-4xl tracking-[-0.01em] text-brand-900 md:text-5xl`}>{t("home.whyTitle")}</h2>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-brand-500">{t("home.whySub")}</p>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 100}>
                <button
                  onClick={() => setActiveFeature(f)}
                  className="group h-full w-full cursor-pointer rounded-[28px] bg-white p-6 text-left shadow-sm ring-1 ring-brand-100/60 transition-all duration-300 hover:shadow-lg hover:shadow-brand-900/5 hover:scale-[1.02]"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 ring-1 ring-brand-100 transition-colors group-hover:bg-green/10 group-hover:ring-green/20">
                    <f.icon className="h-5 w-5 text-brand-700 transition-colors group-hover:text-green" />
                  </div>
                  <h3 className="mb-1.5 text-sm font-bold tracking-tight text-brand-900">{f.title}</h3>
                  <p className="text-[13px] leading-relaxed text-brand-500">{f.desc}</p>
                  <span className="mt-3 inline-block text-[12px] font-medium text-green opacity-0 transition-opacity group-hover:opacity-100">
                    {t("home.readMore")}
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </SectionWrapper>

        {/* ── CIRKELRAM ── */}
        <section className="flex flex-col items-center gap-8 px-6 py-16 md:py-24">
          <Reveal className="w-full max-w-[700px]">
            <MediaFrame
              src="/stock5.jpg"
              alt={t("home.heroImageAlt")}
              shape="circle"
              depth={60}
              sizes="(max-width: 768px) 100vw, 700px"
              className="aspect-square w-full"
            />
          </Reveal>
          <Reveal delay={150}>
            <p className="max-w-md text-center text-[12px] font-semibold uppercase tracking-[0.22em] text-[#766a62]">
              {t("footer.tagline")}
            </p>
          </Reveal>
        </section>

        {/* ── CTA: HUDANALYS ── */}
        <SectionWrapper alt className="!pt-0">
          <Reveal>
            <div className="relative overflow-hidden rounded-[32px] bg-brand-900 px-8 py-16 text-center shadow-xl md:px-16 md:py-24">
              <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full border border-white/5 animate-float" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full border border-white/5 animate-float [animation-delay:2s]" />

              <div className="relative z-10">
                <Pill dark>AI</Pill>
                <h2 className={`${displayFont} mx-auto mt-6 max-w-2xl text-4xl leading-[1.1] tracking-[-0.01em] text-white md:text-5xl`}>
                  {t("home.ctaAnalysisTitle")}
                </h2>
                <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-brand-300">{t("home.ctaAnalysisSub")}</p>
                <div className="mt-10">
                  <Link href={path("skinAnalysis")}>
                    <Button size="lg" className="rounded-full bg-white text-brand-900 shadow-lg hover:bg-brand-50 hover:shadow-xl">
                      {t("home.ctaAnalysisButton")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </SectionWrapper>
      </div>
    </>
  );
}
