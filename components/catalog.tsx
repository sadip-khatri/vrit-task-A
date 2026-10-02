"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Product, SortOrder } from "@/lib/types";
import { ProductCard } from "@/components/product-card";

const money = (n: number) => `$${n.toFixed(0)}`;
export function Catalog({
  products,
  categories,
}: {
  products: Product[];
  categories: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const category = params.get("category") ?? "";
  const search = params.get("search") ?? "";
  const sort = (params.get("sort") === "desc" ? "desc" : "asc") as SortOrder;
  const page = Math.max(1, Number(params.get("page")) || 1);
  const maxPrice = Number(params.get("maxPrice")) || 1000;
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    value ? next.set(key, value) : next.delete(key);
    if (key !== "page") next.delete("page");
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };
  const filtered = useMemo(
    () =>
      products
        .filter(
          (p) =>
            (!category || p.category === category) &&
            p.price <= maxPrice &&
            p.title.toLowerCase().includes(search.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "asc" ? a.price - b.price : b.price - a.price,
        ),
    [products, category, maxPrice, search, sort],
  );
  const pageSize = 8;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  return (
    <>
      <div className="catalog-toolbar">
        <p className="results-count">
          Showing{" "}
          <strong>
            {filtered.length ? (page - 1) * pageSize + 1 : 0}–
            {Math.min(page * pageSize, filtered.length)}
          </strong>{" "}
          of <strong>{filtered.length}</strong> pieces
        </p>
        <div className="toolbar-controls">
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input
              aria-label="Search products"
              placeholder="Find something…"
              value={search}
              onChange={(e) => update("search", e.target.value)}
            />
          </label>
          <label className="sort-control">
            <span className="eyebrow">Sort by</span>
            <select
              aria-label="Sort products"
              value={sort}
              onChange={(e) => update("sort", e.target.value)}
            >
              <option value="asc">Price: low to high</option>
              <option value="desc">Price: high to low</option>
            </select>
          </label>
        </div>
      </div>
      <div className="catalog-layout">
        <aside className="filter-panel">
          <div className="filter-heading">
            <span className="eyebrow">Filters</span>
            <button
              className="reset-button"
              onClick={() => router.push(pathname)}
            >
              Clear
            </button>
          </div>
          <fieldset className="filter-group">
            <legend>Category</legend>
            <button
              className={`category-option ${!category ? "selected" : ""}`}
              onClick={() => update("category", "")}
            >
              All <span>{products.length}</span>
            </button>
            {categories.map((item) => (
              <button
                key={item}
                className={`category-option ${category === item ? "selected" : ""}`}
                onClick={() => update("category", item)}
              >
                {item}
                <span>
                  {products.filter((p) => p.category === item).length}
                </span>
              </button>
            ))}
          </fieldset>
          <fieldset className="filter-group price-filter">
            <legend>Maximum price</legend>
            <div className="price-value">
              <span>Up to</span>
              <strong>{money(maxPrice)}</strong>
            </div>
            <input
              type="range"
              min="20"
              max="1000"
              step="10"
              value={maxPrice}
              onChange={(e) => update("maxPrice", e.target.value)}
              aria-label="Maximum price"
            />
            <div className="range-labels">
              <span>$20</span>
              <span>$1,000+</span>
            </div>
          </fieldset>
        </aside>
        <div className="catalog-results">
          {visible.length ? (
            <div className="product-grid">
              {visible.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try another search or clear your filters.</p>
              <button
                className="text-button"
                onClick={() => router.push(pathname)}
              >
                Clear filters
              </button>
            </div>
          )}
          {pageCount > 1 && (
            <nav className="pagination" aria-label="Product pages">
              <button
                disabled={page <= 1}
                onClick={() => update("page", String(page - 1))}
              >
                ← Previous
              </button>
              <span>
                Page {page} <i>of</i> {pageCount}
              </span>
              <button
                disabled={page >= pageCount}
                onClick={() => update("page", String(page + 1))}
              >
                Next →
              </button>
            </nav>
          )}
        </div>
      </div>
    </>
  );
}
