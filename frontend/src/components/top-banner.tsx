"use client";

import Link from "next/link";

const MESSAGES = [
  "Bli medlem och tjäna poäng vid varje köp",
  "Fri frakt på alla ordrar",
  "14 dagars öppet köp",
  "Silver: 5% rabatt \u00b7 Guld: 8% \u00b7 Platina: 12%",
  "Lös in dina poäng som rabattkoder",
];

export function TopBanner() {
  const repeated = [...MESSAGES, ...MESSAGES];
  const separator = "\u00a0\u00a0\u00a0\u2014\u00a0\u00a0\u00a0";

  return (
    <div className="relative z-50 overflow-hidden bg-brand-900 py-2">
      <Link href="/registrera" className="block">
        <div className="flex animate-marquee whitespace-nowrap">
          {[0, 1].map((set) => (
            <span key={set} className="flex shrink-0 items-center">
              {repeated.map((msg, i) => (
                <span key={`${set}-${i}`} className="text-[11px] font-medium tracking-wide text-white/90">
                  {msg}
                  <span className="text-white/30">{separator}</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </Link>
    </div>
  );
}
