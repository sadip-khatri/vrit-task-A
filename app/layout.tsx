import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { Header } from '@/components/header';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const metadata: Metadata = { metadataBase: new URL(siteUrl), title: { default: 'Store', template: '%s | Store' }, description: 'Browse products, compare prices, and manage your shopping cart.', alternates: { canonical: '/products' }, openGraph: { type: 'website', siteName: 'Store', title: 'Store', description: 'Browse products, compare prices, and manage your shopping cart.' }, robots: { index: true, follow: true } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><Providers><Header/><main>{children}</main></Providers></body></html>; }
