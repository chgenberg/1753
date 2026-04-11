"use client";

import { useState } from "react";
import { Brain, Eye, Layers, Lock, ScanFace, Shield, Zap } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  title: string;
  body: string;
  highlights: string[];
}

const tabIcons: Record<string, React.FC<{ className?: string }>> = {
  model: Brain,
  fusion: Layers,
  tracking: Eye,
  privacy: Shield,
};

export function TechTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id || "");
  const current = tabs.find((t) => t.id === active) || tabs[0];

  return (
    <div>
      {/* Tab buttons */}
      <div className="mx-auto mb-8 flex max-w-3xl flex-wrap justify-center gap-2">
        {tabs.map((tab) => {
          const Icon = tabIcons[tab.id] || Zap;
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-[#108474] text-white shadow-md shadow-[#108474]/20"
                  : "bg-white text-[#515151] hover:bg-white/80 hover:text-[#1d1d1f]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {current && (
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm shadow-black/5 md:p-12">
          <h3 className="mb-4 text-xl font-bold tracking-tight text-[#1d1d1f] md:text-2xl">
            {current.title}
          </h3>
          <div className="space-y-3 text-sm leading-relaxed text-[#515151] md:text-base">
            {current.body.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          {current.highlights.length > 0 && (
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {current.highlights.map((h, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl bg-[#f5f5f7] px-4 py-3"
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#108474]">
                    <svg viewBox="0 0 12 12" className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-[#1d1d1f]">{h}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
