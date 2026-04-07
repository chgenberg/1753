"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { authFetch } from "@/lib/api";

export function useWishlist() {
  const { token, isLoggedIn } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !token) {
      setWishlistIds(new Set());
      setLoaded(true);
      return;
    }
    authFetch<{ product_id: string }[]>("/wishlist", token)
      .then((items) => setWishlistIds(new Set(items.map((i) => i.product_id))))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [isLoggedIn, token]);

  const toggle = useCallback(
    async (productId: string) => {
      if (!isLoggedIn || !token) return false;
      const isInList = wishlistIds.has(productId);
      try {
        if (isInList) {
          await authFetch(`/wishlist/${productId}`, token, { method: "DELETE" });
          setWishlistIds((prev) => {
            const next = new Set(prev);
            next.delete(productId);
            return next;
          });
        } else {
          await authFetch("/wishlist", token, {
            method: "POST",
            body: JSON.stringify({ productId }),
          });
          setWishlistIds((prev) => new Set(prev).add(productId));
        }
        return true;
      } catch {
        return false;
      }
    },
    [isLoggedIn, token, wishlistIds]
  );

  const isWishlisted = useCallback(
    (productId: string) => wishlistIds.has(productId),
    [wishlistIds]
  );

  return { isWishlisted, toggle, loaded, isLoggedIn };
}
