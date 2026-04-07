"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, AtSign, Check, Loader2, Mail, Phone } from "lucide-react";
import { apiFetch } from "@/lib/api";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      await apiFetch("/newsletter/subscribe", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setStatus("success");
      setMsg("Tack! Kolla din inkorg.");
      setEmail("");
    } catch {
      setStatus("error");
      setMsg("Kunde inte prenumerera. Forsok igen.");
    }
  };

  return (
    <footer className="border-t border-brand-100 bg-brand-50/60">
      <div className="mx-auto max-w-[1280px] px-6 py-20 md:px-10">
        <div className="mb-16 flex flex-col items-center text-center">
          <h3 className="text-lg font-bold tracking-tight text-brand-900">
            Hudvardstips och exklusiva erbjudanden
          </h3>
          <p className="mt-2 max-w-md text-sm text-brand-500">
            Fa personliga rad, forhandsinfo om nyheter och rabatter direkt i din inkorg.
          </p>
          <form onSubmit={handleSubscribe} className="mt-5 flex w-full max-w-sm gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
              placeholder="Din e-postadress"
              className="flex-1 rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm shadow-sm placeholder:text-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-900/20"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex h-[46px] items-center gap-1.5 rounded-xl bg-brand-900 px-5 text-sm font-medium text-white transition-all hover:bg-brand-800 active:scale-[0.97] disabled:opacity-60"
            >
              {status === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : status === "success" ? (
                <Check className="h-4 w-4" />
              ) : (
                <>
                  Prenumerera
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>
          {msg && (
            <p className={`mt-2 text-xs ${status === "success" ? "text-green-700" : "text-red-600"}`}>
              {msg}
            </p>
          )}
        </div>

        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <Image
                src="/1753.webp"
                alt="1753 SKINCARE"
                width={40}
                height={40}
              />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-900">
                Skincare
              </span>
            </div>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-brand-500">
              Svensk hudvard med CBD och CBG. Utvecklad for nordisk hud.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-brand-500">
              Navigera
            </h4>
            <div className="flex flex-col gap-2.5">
              {[
                { href: "/", label: "Hem" },
                { href: "/produkter", label: "Produkter" },
                { href: "/om-oss", label: "Om oss" },
                { href: "/kontakt", label: "Kontakt" },
                { href: "/hudanalys", label: "Hudanalys" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-brand-600 transition-colors hover:text-brand-900"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-brand-500">
              Kontakt
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="tel:0732305521"
                className="flex items-center gap-2 text-sm text-brand-600 transition-colors hover:text-brand-900"
              >
                <Phone className="h-3.5 w-3.5" />
                0732 - 30 55 21
              </a>
              <a
                href="mailto:christopher@1753skincare.com"
                className="flex items-center gap-2 text-sm text-brand-600 transition-colors hover:text-brand-900"
              >
                <Mail className="h-3.5 w-3.5" />
                christopher@1753skincare.com
              </a>
              <a
                href="https://instagram.com/1753skincare"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-brand-600 transition-colors hover:text-brand-900"
              >
                <AtSign className="h-3.5 w-3.5" />
                @1753skincare
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-brand-500">
              Adress
            </h4>
            <p className="text-sm leading-relaxed text-brand-600">
              Södra Skjutbanevägen 10
              <br />
              439 55 Åsa
              <br />
              Sverige
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-brand-200/60 pt-8 md:flex-row">
          <p className="text-xs text-brand-500">
            &copy; {new Date().getFullYear()} Floranie International AB. Alla rättigheter förbehållna.
          </p>
          <div className="flex gap-6">
            <Link
              href="/integritetspolicy"
              className="text-xs text-brand-500 hover:text-brand-900"
            >
              Integritetspolicy
            </Link>
            <Link
              href="/villkor"
              className="text-xs text-brand-500 hover:text-brand-900"
            >
              Köpvillkor
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
