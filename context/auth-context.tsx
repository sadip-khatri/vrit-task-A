"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { login as requestLogin } from "@/lib/api";
import type { StoreUser } from "@/lib/types";

interface AuthValue { user: StoreUser | null; ready: boolean; login: (username: string, password: string) => Promise<void>; logout: () => void }
const AuthContext = createContext<AuthValue | null>(null);
const STORAGE_KEY = "atelier-session-v1";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoreUser | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const stored = localStorage.getItem(STORAGE_KEY); if (stored) setUser(JSON.parse(stored) as StoreUser); }
    catch { localStorage.removeItem(STORAGE_KEY); }
    setReady(true);
  }, []);
  const login = useCallback(async (username: string, password: string) => {
    const token = await requestLogin(username, password);
    const session = { username, token };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setUser(session);
  }, []);
  const logout = useCallback(() => { localStorage.removeItem(STORAGE_KEY); setUser(null); }, []);
  const value = useMemo(() => ({ user, ready, login, logout }), [user, ready, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error("useAuth must be used inside AuthProvider"); return value; }
