"use client";
import { useState } from "react";
import { useCart } from "@/context/cart-context";
import type { Product } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
export function AddToCart({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const { user } = useAuth();
  if (!user) return <div className="login-prompt"><Link className="button-primary add-button" href={`/login?next=${encodeURIComponent(`/products/${product.id}`)}`}>Sign in to add to bag</Link></div>;
  return (
    <div className="add-row">
      <div className="quantity-picker">
        <button
          aria-label="Decrease quantity"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
        >
          −
        </button>
        <span>{quantity}</span>
        <button
          aria-label="Increase quantity"
          onClick={() => setQuantity((q) => Math.min(99, q + 1))}
        >
          +
        </button>
      </div>
      <button
        className="button-primary add-button"
        onClick={() => {
          add(product, quantity);
          setAdded(true);
          window.setTimeout(() => setAdded(false), 1600);
        }}
      >
        {added ? "Added to your bag ✓" : "Add to bag"} <span>↗</span>
      </button>
    </div>
  );
}
