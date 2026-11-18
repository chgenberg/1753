"use client";

import { useMemo, useSyncExternalStore } from "react";
import { isJulCampaignActive } from "@/lib/campaign";
import { PRODUCTS, type Product } from "@/lib/products";

// Kontrolleras en gång i minuten så att kampanjen försvinner av sig själv när
// den går ut, även på en sida som står öppen.
function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(id);
}

const snapshot = () => isJulCampaignActive();

// Sidorna är statiskt genererade. Under hydreringen måste klienten utgå från
// samma värde som när HTML:en byggdes, annars får React en hydreringsmiss den
// dag kampanjen har gått ut men sidan inte har byggts om. Rotlayouten skriver
// byggets värde i data-jul på <html>; direkt efter hydreringen tar klockan över.
function serverSnapshot(): boolean {
  if (typeof document === "undefined") return isJulCampaignActive();
  const flag = document.documentElement.dataset.jul;
  if (flag === "1") return true;
  if (flag === "0") return false;
  return isJulCampaignActive();
}

export function useJulCampaignActive(): boolean {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}

/** Produkter för listor: kampanjprodukter visas bara medan kampanjen pågår. */
export function useVisibleProducts(): Product[] {
  const active = useJulCampaignActive();
  return useMemo(() => (active ? PRODUCTS : PRODUCTS.filter((p) => !p.campaign)), [active]);
}
