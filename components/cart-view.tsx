"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
export function CartView() {
  const { items, total, setQuantity, remove } = useCart();
  if (!items.length)
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Add a product to get started.</p>
        <Link className="button-primary" href="/products">
          Browse products
        </Link>
      </div>
    );
  return (
    <div className="cart-layout">
      <div className="cart-items">
        {items.map(({ product, quantity }) => (
          <article className="cart-item" key={product.id}>
            <Link className="cart-item-image" href={`/products/${product.id}`}>
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="120px"
              />
            </Link>
            <div className="cart-item-info">
              <span className="eyebrow">{product.category}</span>
              <Link
                href={`/products/${product.id}`}
                className="cart-item-title"
              >
                {product.title}
              </Link>
              <span className="cart-item-price">
                ${product.price.toFixed(2)}
              </span>
              <div className="cart-item-actions">
                <div className="quantity-picker">
                  <button
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity(product.id, quantity - 1)}
                  >
                    −
                  </button>
                  <span>{quantity}</span>
                  <button
                    aria-label="Increase quantity"
                    onClick={() => setQuantity(product.id, quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="remove-button"
                  onClick={() => remove(product.id)}
                >
                  Remove
                </button>
              </div>
            </div>
            <strong className="line-total">
              ${(quantity * product.price).toFixed(2)}
            </strong>
          </article>
        ))}
      </div>
      <aside className="order-summary">
        <h2>Order summary</h2>
        <div className="summary-total">
          <span>Total</span>
          <strong>${total.toFixed(2)}</strong>
        </div>
        <Link className="continue-link" href="/products">
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
