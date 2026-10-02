"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
export function CartGate({ children }: { children: ReactNode }) { const { user, ready } = useAuth(); if (!ready) return <p>Loading your session…</p>; if (!user) return <div className="empty-cart"><h2>Sign in to access your cart</h2><p>Your bag is available after you log in.</p><Link className="button-primary" href="/login?next=%2Fcart">Sign in</Link></div>; return <>{children}</>; }
