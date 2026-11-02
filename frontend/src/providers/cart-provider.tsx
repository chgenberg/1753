"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface CartItem {
  id: string;
  qty: number;
  subscription?: {
    intervalDays: number;
  };
}

interface CartContextValue {
  items: CartItem[];
  addItem: (id: string, qty?: number, subscription?: { intervalDays: number }) => void;
  addItems: (items: { id: string; qty: number }[]) => void;
  removeItem: (id: string) => void;
  replaceItem: (cartId: string, newProductId: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "cart1753";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(readCart());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) writeCart(items);
  }, [items, mounted]);

  const addItem = useCallback((id: string, qty = 1, subscription?: { intervalDays: number }) => {
    const cartId = subscription ? `${id}__sub` : id;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === cartId);
      if (existing) {
        return prev.map((i) =>
          i.id === cartId ? { ...i, qty: i.qty + qty, subscription } : i
        );
      }
      return [...prev, { id: cartId, qty, subscription }];
    });
    setIsOpen(true);
  }, []);

  const addItems = useCallback((newItems: { id: string; qty: number }[]) => {
    setItems((prev) => {
      let updated = [...prev];
      for (const ni of newItems) {
        const existing = updated.find((i) => i.id === ni.id);
        if (existing) {
          updated = updated.map((i) => i.id === ni.id ? { ...i, qty: i.qty + ni.qty } : i);
        } else {
          updated.push({ id: ni.id, qty: ni.qty });
        }
      }
      return updated;
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  // Byter produkt på en rad men behåller antal och ev. prenumeration.
  const replaceItem = useCallback((cartId: string, newProductId: string) => {
    setItems((prev) => {
      const line = prev.find((i) => i.id === cartId);
      if (!line) return prev;
      const newCartId = line.subscription ? `${newProductId}__sub` : newProductId;
      const rest = prev.filter((i) => i.id !== cartId);
      const existing = rest.find((i) => i.id === newCartId);
      if (existing) {
        return rest.map((i) => (i.id === newCartId ? { ...i, qty: i.qty + line.qty } : i));
      }
      return [...rest, { id: newCartId, qty: line.qty, subscription: line.subscription }];
    });
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, qty } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        addItems,
        removeItem,
        replaceItem,
        updateQty,
        clearCart,
        totalItems,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        toggleCart: () => setIsOpen((p) => !p),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
