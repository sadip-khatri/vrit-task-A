import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";
export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: true },
};
export default function LoginPage() {
  return (
    <div className="page-shell cart-shell">
      <div className="cart-page-heading">
        <h1>Sign in</h1>
        <p>Log in to access your shopping bag.</p>
      </div>
      <Suspense fallback={<p>Loading sign in…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
