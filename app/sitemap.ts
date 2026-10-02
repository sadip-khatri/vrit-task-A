import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  try { products = await getProducts(); } catch { /* Keep static URLs available during API outages. */ }
  return [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/products`, changeFrequency: "daily", priority: 0.9 },
    ...products.map((product) => ({ url: `${siteUrl}/products/${product.id}`, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
