"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Sparkles, Headphones, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/providers/cart-provider";
import { useLocale } from "@/providers/locale-provider";

const STORAGE_KEY = "1753_podcast_popup_sparre_v1";
const DISCOUNT_CODE = "sparre";
const PACKAGE_ID = "duo-ta-da";
const EPISODE_URL = "https://4health.se";

export function PodcastPopup() {
  const { locale } = useLocale();
  const { addItem, openCart } = useCart();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (locale !== "sv") return;
    if (typeof window === "undefined") return;
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      return;
    }
    const t = window.setTimeout(() => {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    }, 900);
    return () => window.clearTimeout(t);
  }, [locale]);

  useEffect(() => {
    if (!visible) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const persistDismissed = () => {
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      /* ignore */
    }
  };

  const handleClose = () => {
    setVisible(false);
    persistDismissed();
    window.setTimeout(() => setMounted(false), 350);
  };

  const handleApply = () => {
    addItem(PACKAGE_ID, 1);
    try {
      localStorage.setItem("1753_auto_discount", DISCOUNT_CODE);
    } catch {
      /* ignore */
    }
    setAdded(true);
    persistDismissed();
    window.setTimeout(() => {
      setVisible(false);
      openCart();
      window.setTimeout(() => setMounted(false), 350);
    }, 600);
  };

  if (!mounted) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="podcast-popup-title"
      className={`fixed inset-0 z-[1000] flex items-end justify-center sm:items-center sm:p-6 transition-opacity duration-300 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div
        className={`relative w-full max-w-[640px] overflow-hidden rounded-t-3xl bg-white shadow-2xl shadow-black/20 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] sm:rounded-3xl ${
          visible ? "translate-y-0 scale-100" : "translate-y-8 scale-[0.98]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Stäng"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#1d1d1f] shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-lg active:scale-95"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid sm:grid-cols-[42%_58%]">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f5f5f7] sm:aspect-auto sm:h-full">
            <Image
              src="/podcast.png"
              alt="4Health podcast – avsnitt 386 med Christopher Genberg"
              fill
              sizes="(max-width: 640px) 100vw, 268px"
              priority
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent p-4 sm:hidden">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#108474]">
                <Headphones className="h-3 w-3" />
                Avsnitt 386
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-5 px-6 py-7 sm:px-8 sm:py-8">
            <span className="hidden sm:inline-flex items-center gap-1.5 self-start rounded-full bg-[#108474]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#108474]">
              <Headphones className="h-3 w-3" />
              4Health – Avsnitt 386
            </span>

            <div className="space-y-2">
              <h2
                id="podcast-popup-title"
                className="text-[1.5rem] font-semibold leading-tight tracking-tight text-[#1d1d1f] sm:text-[1.75rem]"
              >
                AI, hälsa &amp; hud
              </h2>
              <p className="text-sm leading-relaxed text-[#515151]">
                Din hud är kroppens ärligaste organ – ett fönster in i tarm,
                lever, nervsystem, hormoner och mikrobiom. Lyssna på Christopher
                Genberg hos Anna Sparre om vad akne, rodnad och torrhet
                egentligen säger om din hälsa.
              </p>
            </div>

            <div className="rounded-2xl border border-[#108474]/15 bg-gradient-to-br from-[#108474]/[0.06] to-transparent p-4">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#108474]">
                <Sparkles className="h-3 w-3" />
                Lyssnar-erbjudande
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-[#1d1d1f]">
                Ange rabattkoden{" "}
                <span className="inline-flex items-center rounded-md bg-white px-2 py-0.5 font-mono text-[13px] font-bold tracking-wider text-[#108474] shadow-sm ring-1 ring-[#108474]/15">
                  SPARRE
                </span>{" "}
                vid köp av <strong className="font-semibold">DUO-kit + TA-DA</strong>{" "}
                så bjuder vi på TA-DA Serum – ett värde på 699 kr.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleApply}
                disabled={added}
                className={`group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] active:scale-[0.98] ${
                  added
                    ? "bg-[#108474] text-white"
                    : "bg-[#1d1d1f] text-white shadow-lg shadow-black/10 hover:bg-[#108474] hover:shadow-xl hover:shadow-[#108474]/20"
                }`}
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4" />
                    Tillagt i varukorgen
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    Lägg paketet i varukorgen
                  </>
                )}
              </button>
              <a
                href={EPISODE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={persistDismissed}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#e6e6e6] bg-white px-6 text-sm font-medium text-[#1d1d1f] transition-all duration-300 hover:border-[#108474]/30 hover:bg-[#108474]/5 hover:text-[#108474]"
              >
                <Headphones className="h-4 w-4" />
                Lyssna på avsnittet
              </a>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="self-center text-xs text-[#766a62] underline-offset-4 transition-colors hover:text-[#1d1d1f] hover:underline"
            >
              Nej tack, stäng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
