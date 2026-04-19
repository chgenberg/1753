"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

interface Item {
  slug: string;
  title: string;
  lead: string;
  category: string;
  href: string;
}

interface Labels {
  placeholder: string;
  empty: string;
  countSuffix: string;
}

export default function AllGuidesSearch({ items, labels }: { items: Item[]; labels: Labels }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter(
      (it) =>
        it.title.toLowerCase().includes(needle) ||
        it.category.toLowerCase().includes(needle) ||
        it.lead.toLowerCase().includes(needle) ||
        it.slug.toLowerCase().includes(needle),
    );
  }, [items, q]);

  const groupedByFirstLetter = useMemo(() => {
    const out = new Map<string, Item[]>();
    for (const it of filtered) {
      const raw = it.title.trim();
      const first = (raw[0] || "#").toUpperCase();
      const key = /[A-Za-zÅÄÖÆØÜ]/.test(first) ? first : "#";
      if (!out.has(key)) out.set(key, []);
      out.get(key)!.push(it);
    }
    return Array.from(out.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <div className="sticky top-16 z-10 -mx-6 border-b border-[#e6e6e6] bg-white/85 px-6 py-4 backdrop-blur md:-mx-10 md:px-10">
          <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#766a62]" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={labels.placeholder}
                className="h-12 w-full rounded-full border border-[#e6e6e6] bg-white pl-11 pr-5 text-sm outline-none transition-all focus:border-[#108474] focus:shadow-[0_0_0_3px_rgba(16,132,116,0.12)]"
              />
            </div>
            <p className="text-xs font-medium text-[#766a62]">
              {filtered.length} {labels.countSuffix}
            </p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="mt-20 text-center text-sm text-[#766a62]">{labels.empty}</p>
        ) : (
          <div className="mt-10 space-y-12">
            {groupedByFirstLetter.map(([letter, group]) => (
              <div key={letter}>
                <h2 className="mb-4 text-xl font-bold tracking-tight text-[#1d1d1f]">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#108474]/10 text-[#108474]">
                    {letter}
                  </span>
                </h2>
                <div className="grid gap-2">
                  {group.map((it) => (
                    <Link
                      key={it.slug}
                      href={it.href}
                      className="group flex items-center justify-between gap-4 rounded-xl border border-transparent px-3 py-3 transition-all hover:border-[#108474]/30 hover:bg-white hover:shadow-sm"
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold text-[#1d1d1f] group-hover:text-[#108474]">
                          {it.title}
                        </h3>
                        <p className="mt-0.5 truncate text-xs text-[#766a62]">
                          {it.category}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 flex-shrink-0 text-[#766a62] transition-transform group-hover:translate-x-0.5 group-hover:text-[#108474]" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
