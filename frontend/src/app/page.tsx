"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
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
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Leaf,
    title: "Naturliga ingredienser",
    desc: "CBD och CBG från ekologiskt odlad hampa, utan syntetiska tillsatser.",
  },
  {
    icon: Shield,
    title: "100% nöjd-garanti",
    desc: "Prova i 14 dagar. Inte nöjd? Pengarna tillbaka, inga frågor.",
  },
  {
    icon: Droplets,
    title: "Djup återfuktning",
    desc: "Cannabinoider stärker hudens barriär och binder fukt på djupet.",
  },
  {
    icon: Sparkles,
    title: "Synliga resultat",
    desc: "De flesta ser förbättring inom 14 dagar. Över 1 000 nöjda kunder.",
  },
];

const TRUST_ITEMS = [
  { icon: Truck, text: "Fri frakt över 700 kr" },
  { icon: Shield, text: "14 dagars nöjd-garanti" },
  { icon: Star, text: "4.8 av 5 i omdömen" },
];

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

        {/* Play button */}
        <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-xl shadow-brand-900/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl md:h-20 md:w-20">
          <Play className="ml-1 h-6 w-6 fill-brand-900 text-brand-900 md:h-7 md:w-7" />
        </div>
      </button>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="py-12 md:py-20 lg:py-28">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          <div className="flex flex-col-reverse items-center gap-10 md:flex-row md:gap-16 lg:gap-20">
            {/* Left: text + CTA */}
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

              {/* Trust row */}
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

            {/* Right: video */}
            <div className="w-full max-w-xs flex-shrink-0 md:max-w-sm lg:max-w-md">
              <VideoEmbed />
            </div>
          </div>
        </div>
      </section>

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
            <div
              key={f.title}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-brand-100/60 transition-all duration-300 hover:shadow-lg hover:shadow-brand-900/5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 ring-1 ring-brand-100">
                <f.icon className="h-5 w-5 text-brand-700" />
              </div>
              <h3 className="mb-1.5 text-sm font-bold tracking-tight text-brand-900">
                {f.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-brand-500">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Products */}
      <SectionWrapper>
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
