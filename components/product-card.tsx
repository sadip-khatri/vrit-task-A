import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  return (
    <article
      className="product-card"
      style={{ animationDelay: `${index * 55}ms` }}
    >
      <Link href={`/products/${product.id}`} className="product-image-wrap">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 25vw"
          className="product-image"
        />
        <span className="image-arrow">↗</span>
      </Link>
      <div className="product-meta">
        <span className="eyebrow category-label">{product.category}</span>
        <span className="rating">★ {product.rating.rate}</span>
      </div>
      <Link href={`/products/${product.id}`} className="product-title">
        {product.title}
      </Link>
      <div className="product-price">${product.price.toFixed(2)}</div>
    </article>
  );
}
