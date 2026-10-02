"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "@/lib/types";

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  add: (product: Product, quantity?: number) => void;
  setQuantity: (id: number, quantity: number) => void;
  remove: (id: number) => void;
}
const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "atelier-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored) as CartItem[]);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);
  const add = useCallback(
    (product: Product, quantity = 1) =>
      setItems((current) => {
        const existing = current.find((item) => item.product.id === product.id);
        return existing
          ? current.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            )
          : [...current, { product, quantity }];
      }),
    [],
  );
  const setQuantity = useCallback(
    (id: number, quantity: number) =>
      setItems((current) =>
        quantity < 1
          ? current.filter((item) => item.product.id !== id)
          : current.map((item) =>
              item.product.id === id
                ? { ...item, quantity: Math.min(quantity, 99) }
                : item,
            ),
      ),
    [],
  );
  const remove = useCallback(
    (id: number) =>
      setItems((current) => current.filter((item) => item.product.id !== id)),
    [],
  );
  const value = useMemo(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      total: items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      ),
      add,
      setQuantity,
      remove,
    }),
    [items, add, setQuantity, remove],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
