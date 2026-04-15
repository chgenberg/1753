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

      <section className="py-10 md:py-16 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {/* Text box – same 1:1 aspect as image (order-2 on mobile so image stacks above) */}
            <div className="relative order-2 flex aspect-square flex-col justify-center rounded-3xl bg-[#f5f5f7] p-8 shadow-lg shadow-brand-900/5 ring-1 ring-brand-100/60 md:order-1 md:p-12 lg:p-16">
              <h1 className="text-4xl font-bold tracking-tight text-brand-900 md:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
                {t("home.heroLine1")}
                <br />
                {t("home.heroLine2")}
              </h1>
              <p className="mt-5 max-w-sm text-base leading-relaxed text-brand-500 md:text-lg">
                {t("home.heroSub")}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href={homeHash("#produkter")}>
                  <Button size="lg" pulse>
                    {t("home.ctaProducts")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-5">
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
            </div>

            {/* Image box – 1:1 aspect (order-1 on mobile: hero image above text) */}
            <div className="relative order-1 aspect-square overflow-hidden rounded-3xl shadow-lg shadow-brand-900/5 ring-1 ring-brand-100/60 md:order-2">
              <Image
                src="/Bakgrund_hero_2.jpg"
                alt={t("home.heroImageAlt")}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5" />
            </div>
          </div>
        </div>
      </section>

      <SectionWrapper className="!py-10 md:!py-14">
        <div id="produkter" className="-mt-20 pt-20" />
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-brand-900">{t("home.sortimentTitle")}</h2>
          <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-brand-500">{t("home.sortimentSub")}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {PRODUCTS.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 2} />
          ))}
        </div>
      </SectionWrapper>

      <ReviewCarousel />

      <SectionWrapper alt>
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-brand-900">{t("home.whyTitle")}</h2>
          <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-brand-500">{t("home.whySub")}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <button
              key={f.title}
              onClick={() => setActiveFeature(f)}
              className="group cursor-pointer rounded-2xl bg-white p-6 text-left shadow-sm ring-1 ring-brand-100/60 transition-all duration-300 hover:shadow-lg hover:shadow-brand-900/5 hover:scale-[1.02]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 ring-1 ring-brand-100 transition-colors group-hover:bg-green/10 group-hover:ring-green/20">
                <f.icon className="h-5 w-5 text-brand-700 transition-colors group-hover:text-green" />
              </div>
              <h3 className="mb-1.5 text-sm font-bold tracking-tight text-brand-900">{f.title}</h3>
              <p className="text-[13px] leading-relaxed text-brand-500">{f.desc}</p>
              <span className="mt-3 inline-block text-[12px] font-medium text-green opacity-0 transition-opacity group-hover:opacity-100">
                {t("home.readMore")}
              </span>
            </button>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper alt>
        <div className="relative overflow-hidden rounded-3xl bg-brand-900 px-8 py-16 text-center shadow-xl md:px-16 md:py-20">
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full border border-white/5 animate-float" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full border border-white/5 animate-float [animation-delay:2s]" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">{t("home.ctaAnalysisTitle")}</h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-brand-300">{t("home.ctaAnalysisSub")}</p>
            <div className="mt-10">
              <Link href={path("skinAnalysis")}>
                <Button size="lg" className="bg-white text-brand-900 shadow-lg hover:bg-brand-50 hover:shadow-xl">
                  {t("home.ctaAnalysisButton")}
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
