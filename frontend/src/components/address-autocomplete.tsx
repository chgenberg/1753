"use client";

import { useEffect, useId, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Locale } from "@/lib/i18n/types";

export type AddressSuggestion = {
  label: string;
  address: string;
  zip: string;
  city: string;
};

type Props = {
  value: string;
  country: string;
  locale: Locale;
  placeholder: string;
  listLabel: string;
  onChange: (address: string) => void;
  onSelect: (suggestion: AddressSuggestion) => void;
};

export function AddressAutocomplete({
  value,
  country,
  locale,
  placeholder,
  listLabel,
  onChange,
  onSelect,
}: Props) {
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    setSuggestions([]);
    setOpen(false);
    setActive(0);
  }, [country]);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const fetchSuggestions = (q: string, shipCountry: string) => {
    abortRef.current?.abort();
    if (q.trim().length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const params = new URLSearchParams({
      q: q.trim(),
      country: shipCountry,
      locale,
    });
    apiFetch<{ suggestions: AddressSuggestion[] }>(`/address/suggest?${params}`, {
      signal: ctrl.signal,
    })
      .then((data) => {
        const next = data.suggestions || [];
        setSuggestions(next);
        setActive(0);
        setOpen(next.length > 0);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setSuggestions([]);
        setOpen(false);
      });
  };

  const handleChange = (next: string) => {
    onChange(next);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchSuggestions(next, country), 350);
  };

  const choose = (item: AddressSuggestion) => {
    onSelect(item);
    setSuggestions([]);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(suggestions[active] || suggestions[0]);
    }
  };

  return (
    <div ref={wrapRef} className="relative">
      <input
        id="checkout-address"
        type="text"
        required
        autoComplete="street-address"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0) setOpen(true);
        }}
        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
        placeholder={placeholder}
      />
      {open && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          aria-label={listLabel}
          data-lenis-prevent
          className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-[#e6e6e6] bg-white py-1 shadow-lg"
        >
          {suggestions.map((item, i) => (
            <li
              key={`${item.address}-${item.zip}-${item.city}-${i}`}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              className={`cursor-pointer px-4 py-2.5 text-sm leading-snug ${
                i === active ? "bg-[#108474]/10 text-[#1d1d1f]" : "text-[#1d1d1f]"
              }`}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(item);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
