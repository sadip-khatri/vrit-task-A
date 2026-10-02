import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Catalog } from '@/components/catalog';
import { getCategories, getProducts } from '@/lib/products';
import type { SortOrder } from '@/lib/types';
export const metadata: Metadata = { title: 'Products', description: 'Browse and search products.' };
export default async function ProductsPage({ searchParams }: { searchParams: { sort?: string | string[] } }) {
  const sort: SortOrder = (Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort) === 'desc' ? 'desc' : 'asc';
  const [products,categories] = await Promise.all([getProducts(sort),getCategories()]);
  return <div className="page-shell"><section className="collection-hero"><div className="hero-copy"><span className="eyebrow">OUR PRODUCTS</span><h1>Find your next<br/><em>favourite.</em></h1><p>Browse the collection, search by name, or filter by category and price.</p></div></section><section className="collection-section"><Suspense fallback={<div className="loading-grid">{Array.from({length:8},(_,i)=><div className="skeleton-card" key={i}><div/><span/><i/></div>)}</div>}><Catalog products={products} categories={categories}/></Suspense></section></div>;
}
