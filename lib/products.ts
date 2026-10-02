import { apiFetch } from '@/lib/api';
import type { Product, SortOrder } from '@/lib/types';

export const getProducts = (sort: SortOrder = 'asc') => apiFetch<Product[]>(`/products?sort=${sort}`, { next: { revalidate: 300 } });
export const getProduct = (id: string) => apiFetch<Product>(`/products/${encodeURIComponent(id)}`, { next: { revalidate: 300 } });
export const getCategories = () => apiFetch<string[]>('/products/categories', { next: { revalidate: 3600 } });
