"use client";
import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/lib/api";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState("john_doe");
  const [password, setPassword] = useState("pass123");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(username, password);
      router.replace(params.get("next") || "/products");
    } catch (e) {
      setError(
        e instanceof ApiError
          ? e.message
          : "Login failed. Check your credentials and try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="login-form" onSubmit={submit}>
      <label>
        Username
        <input
          autoComplete="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Password
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {error && (
        <p role="alert" className="login-error">
          {error}
        </p>
      )}
      <button className="button-primary" disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
      <Link href="/products">Continue browsing</Link>
    </form>
  );
}
