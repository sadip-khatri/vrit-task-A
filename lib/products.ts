import { apiFetch, ApiError } from '@/lib/api';
import type { Product, SortOrder } from '@/lib/types';

const FALLBACK = 'https://dummyjson.com';

interface DummyProduct { id: number; title: string; price: number; description: string; category: string; thumbnail: string; rating: number; reviews?: unknown[] }

const mapDummy = (p: DummyProduct): Product => ({
  id: p.id, title: p.title, price: p.price, description: p.description, category: p.category,
  image: p.thumbnail, rating: { rate: p.rating, count: p.reviews?.length ?? 0 },
});

async function fallbackJson<T>(path: string, revalidate: number): Promise<T> {
  const res = await fetch(`${FALLBACK}${path}`, { next: { revalidate } });
  if (!res.ok) throw new ApiError(`The store could not load this information (HTTP ${res.status}). Please try again.`, res.status);
  return res.json() as Promise<T>;
}

/** Try FakeStoreAPI first; if it blocks us (403) or is unreachable, use DummyJSON. 404s are passed through. */
async function withFallback<T>(primary: () => Promise<T>, backup: () => Promise<T>): Promise<T> {
  try { return await primary(); }
  catch (e) {
    if (e instanceof ApiError && e.status === 404) throw e;
    return backup();
  }
}

export const getProducts = (sort: SortOrder = 'asc') => withFallback(
  () => apiFetch<Product[]>(`/products?sort=${sort}`, { next: { revalidate: 300 } }),
  async () => {
    const d = await fallbackJson<{ products: DummyProduct[] }>(`/products?limit=20&sortBy=id&order=${sort}`, 300);
    return d.products.map(mapDummy);
  },
);

export const getProduct = (id: string) => withFallback(
  () => apiFetch<Product>(`/products/${encodeURIComponent(id)}`, { next: { revalidate: 300 } }),
  async () => mapDummy(await fallbackJson<DummyProduct>(`/products/${encodeURIComponent(id)}`, 300)),
);

export const getCategories = () => withFallback(
  () => apiFetch<string[]>('/products/categories', { next: { revalidate: 3600 } }),
  () => fallbackJson<string[]>('/products/category-list', 3600),
);