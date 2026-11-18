"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { getImageProps } from "next/image";
import { ArrowRight, Check, Plus } from "lucide-react";
import { Snow } from "@/components/fx/snow";
import { displayFont } from "@/components/fx/motion";
import { useJulCampaignActive } from "@/hooks/use-jul-campaign";
import { JUL_CAMPAIGN } from "@/lib/campaign";
import { formatPrice } from "@/lib/currency";
import { cartProductId, getProduct, productOriginalPrice, productPrice } from "@/lib/products";
import { cn } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";
import { useLocale } from "@/providers/locale-provider";

type SpotId = "duo" | "gift";

// Var produkterna står i respektive bild, i procent av bildens bredd och höjd.
const SPOTS: Record<SpotId, { mobile: [number, number]; desktop: [number, number] }> = {
  duo: { mobile: [41.5, 71.2], desktop: [42.7, 71] },
  gift: { mobile: [60.9, 72.3], desktop: [51.3, 70.3] },
};

function Hotspot({
  id,
  href,
  title,
  sub,
  label,
}: {
  id: SpotId;
  href: string;
  title: string;
  sub: string;
  label: string;
}) {
  const { mobile, desktop } = SPOTS[id];
  const style = {
    "--mx": `${mobile[0]}%`,
    "--my": `${mobile[1]}%`,
    "--dx": `${desktop[0]}%`,
    "--dy": `${desktop[1]}%`,
  } as CSSProperties;

  return (
    <Link
      href={href}
      aria-label={label}
      style={style}
      className="group absolute left-[var(--mx)] top-[var(--my)] z-[2] flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none min-[500px]:left-[var(--dx)] min-[500px]:top-[var(--dy)]"
    >
      <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-white/25 ring-1 ring-white/60 backdrop-blur-sm transition-transform duration-300 group-hover:scale-125 group-focus-visible:scale-125 group-focus-visible:ring-2 group-focus-visible:ring-white">
        <span
          aria-hidden
          className="absolute inset-0 animate-ping rounded-full bg-white/35 [animation-duration:3.2s] motion-reduce:hidden"
        />
        <span aria-hidden className="relative h-2 w-2 rounded-full bg-white shadow-sm" />
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-2xl bg-white/85 px-3.5 py-2 text-left opacity-0 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
      >
        <span className="block text-[12px] font-semibold leading-tight text-[#1d1d1f]">{title}</span>
        <span className="mt-0.5 flex items-center gap-1 text-[11px] leading-tight text-[#515151]">
          {sub}
          <ArrowRight className="h-3 w-3 shrink-0" />
        </span>
      </span>
    </Link>
  );
}

/**
 * Julkampanjens hero på startsidan: kampanjbilden i ett stort rundat kort med
 * stilla snöfall, lätt parallax mot muspekaren och två punkter på produkterna
 * som leder till respektive produktsida.
 * Visas bara medan kampanjen pågår.
 */
export function JulHero() {
  const active = useJulCampaignActive();
  const { t, locale, path } = useLocale();
  const { addItem, openCart } = useCart();
  const parallaxRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const [settled, setSettled] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setSettled(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      parallaxRef.current?.style.setProperty("--jx", x.toFixed(3));
      parallaxRef.current?.style.setProperty("--jy", y.toFixed(3));
    });
  }, []);

  const onPointerLeave = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    parallaxRef.current?.style.setProperty("--jx", "0");
    parallaxRef.current?.style.setProperty("--jy", "0");
  }, []);

  const kit = getProduct(JUL_CAMPAIGN.productId);
  const gift = getProduct(JUL_CAMPAIGN.giftProductId);
  if (!active || !kit || !gift) return null;

  const price = productPrice(kit, locale);
  const origPrice = productOriginalPrice(kit, locale);
  const giftValue = formatPrice(productPrice(gift, locale), locale);
  const alt = t("jul.imageAlt");

  // Två olika beskärningar: stående bild i mobilen, liggande från 500 px.
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ alt, src: "/jul/jul-hero-desktop.jpg", width: 2400, height: 1340, sizes: "100vw" });
  const {
    props: { srcSet: mobileSrcSet, ...img },
  } = getImageProps({
    alt,
    src: "/jul/jul-hero-mobile.jpg",
    width: 1200,
    height: 2150,
    sizes: "100vw",
    loading: "eager",
    fetchPriority: "high",
  });

  const handleAdd = () => {
    addItem(cartProductId(kit));
    openCart();
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  const productHref = path("product", { productId: kit.id });

  return (
    <section aria-labelledby="jul-hero-title" className="relative z-[2] px-3 pt-1 md:px-4">
      <div
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="relative mx-auto w-full overflow-hidden rounded-[32px] bg-[#ece0d2] shadow-[0_30px_60px_rgba(0,0,0,0.08)] [container-type:inline-size] md:rounded-[44px] lg:w-[min(100%,calc((100svh-136px)*16/9))]"
      >
        <div className="relative aspect-[9/16] w-full overflow-hidden min-[500px]:aspect-[16/9]">
          {/* Kortet har alltid bildens proportioner, så punkterna på produkterna hamnar rätt. */}
          <div className="absolute inset-0">
            <div
              className={cn(
                "absolute inset-0 transition-transform duration-[2200ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] motion-reduce:transition-none",
                settled ? "scale-[1.03]" : "scale-[1.09]"
              )}
            >
              <div
                ref={parallaxRef}
                className="absolute inset-0 transition-transform duration-500 ease-out will-change-transform motion-reduce:transform-none"
                style={{
                  transform: "translate3d(calc(var(--jx, 0) * -12px), calc(var(--jy, 0) * -8px), 0)",
                }}
              >
                <picture>
                  <source media="(min-width: 500px)" srcSet={desktopSrcSet} sizes="100vw" />
                  <source srcSet={mobileSrcSet} sizes="100vw" />
                  <img {...img} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
                </picture>
                <Hotspot
                  id="duo"
                  href={path("product", { productId: "duo-kit" })}
                  title={t("jul.hotspotDuo")}
                  sub={t("jul.hotspotDuoSub", { price: formatPrice(price, locale) })}
                  label={t("jul.hotspotShow", { product: t("jul.hotspotDuo") })}
                />
                <Hotspot
                  id="gift"
                  href={path("product", { productId: JUL_CAMPAIGN.giftProductId })}
                  title={t("jul.hotspotGift")}
                  sub={t("jul.hotspotGiftSub", { amount: giftValue })}
                  label={t("jul.hotspotShow", { product: t("jul.hotspotGift") })}
                />
              </div>
            </div>
          </div>

          {/* Ljusare vägg bakom rubriken, så att texten går att läsa utan ruta. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[36%] bg-gradient-to-b from-[#f4ebe1]/90 via-[#f4ebe1]/45 to-transparent min-[500px]:hidden lg:inset-y-0 lg:left-0 lg:right-auto lg:block lg:h-auto lg:w-[46%] lg:bg-gradient-to-r lg:from-[#f4ebe1]/80 lg:via-[#f4ebe1]/35"
          />
          <Snow className="z-[2]" />
        </div>

        <div
          className={cn(
            "absolute inset-x-0 top-0 z-[3] px-5 pt-5 transition-all duration-1000 ease-out motion-reduce:transition-none",
            "min-[500px]:static min-[500px]:px-8 min-[500px]:pt-8",
            "lg:absolute lg:inset-x-auto lg:left-[5%] lg:top-[8.5%] lg:w-[31%] lg:p-0",
            settled ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          )}
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="inline-block rounded-full bg-white/75 px-3 pt-[5px] pb-[3px] text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1d1d1f] shadow-sm backdrop-blur-md min-[500px]:px-3.5 min-[500px]:text-[11px] min-[500px]:tracking-[0.2em]">
              {t("jul.kicker")}
            </span>
            <span className="text-[11px] font-medium text-[#1d1d1f]/75 min-[500px]:text-[12px]">{t("jul.until")}</span>
          </div>
          <h2
            id="jul-hero-title"
            className={`${displayFont} mt-3 text-[clamp(1.7rem,8.4cqw,2.5rem)] leading-[1.04] tracking-[-0.015em] text-[#1d1d1f] min-[500px]:text-[clamp(2rem,5.6cqw,3rem)] lg:mt-[1.4cqw] lg:text-[clamp(2rem,3.75cqw,4rem)]`}
          >
            {t("jul.titleLine1")}
            <br />
            {t("jul.titleLine2")}{" "}
            <em className="whitespace-nowrap text-[#108474] [font-style:italic] lg:block">{t("jul.titleAccent")}</em>
          </h2>
          <p className="mt-4 hidden max-w-[36ch] text-[15px] leading-relaxed text-[#1d1d1f]/80 min-[500px]:block lg:mt-[1.3cqw] lg:text-[clamp(0.85rem,1.12cqw,1.0625rem)]">
            {t("jul.body")}
          </p>
        </div>

        <div
          className={cn(
            "absolute inset-x-2.5 bottom-2.5 z-[3] flex items-center justify-between gap-3 rounded-[28px] bg-white/75 p-1.5 pl-4 shadow-[0_10px_30px_rgba(0,0,0,0.10)] backdrop-blur-xl",
            "min-[500px]:static min-[500px]:flex-wrap min-[500px]:justify-start min-[500px]:gap-x-6 min-[500px]:gap-y-4 min-[500px]:rounded-none min-[500px]:bg-transparent min-[500px]:p-8 min-[500px]:pt-6 min-[500px]:shadow-none min-[500px]:backdrop-blur-none",
            "lg:absolute lg:inset-x-auto lg:bottom-[4.5%] lg:left-[4%] lg:flex-nowrap lg:rounded-full lg:bg-white/75 lg:p-2 lg:pl-7 lg:shadow-[0_10px_30px_rgba(0,0,0,0.10)] lg:backdrop-blur-xl"
          )}
        >
          <div className="min-w-0">
            <p className="flex items-baseline gap-2">
              <span className="whitespace-nowrap text-lg font-semibold tracking-tight text-[#1d1d1f] min-[500px]:text-xl">
                {formatPrice(price, locale)}
              </span>
              {origPrice && (
                <span className="hidden whitespace-nowrap text-sm text-[#766a62] line-through min-[500px]:inline">
                  {formatPrice(origPrice, locale)}
                </span>
              )}
            </p>
            <p className="text-[11px] font-semibold leading-tight text-[#0d6e62]">{t("jul.valueLine", { amount: giftValue })}</p>
          </div>
          <div className="flex shrink-0 items-center gap-5">
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex h-11 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-[#108474] px-4 text-sm font-semibold text-white shadow-lg shadow-[#108474]/25 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:scale-[1.02] hover:bg-[#0d6e62] hover:shadow-xl hover:shadow-[#108474]/30 active:scale-[0.98] min-[500px]:h-12 min-[500px]:px-6"
            >
              {added ? <Check className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
              {t("jul.cta")}
            </button>
            <Link
              href={productHref}
              className="group/more hidden items-center gap-1.5 pr-5 text-sm font-semibold text-[#1d1d1f] underline-offset-4 hover:underline min-[500px]:inline-flex"
            >
              {t("jul.more")}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/more:translate-x-0.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-3 text-center min-[500px]:hidden">
        <Link
          href={productHref}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1d1d1f] underline-offset-4 hover:underline"
        >
          {t("jul.more")}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </p>
    </section>
  );
}
