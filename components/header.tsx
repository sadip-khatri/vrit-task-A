"use client";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
export function Header() {
  const { count } = useCart();
  const { user, logout } = useAuth(); const router = useRouter();
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="wordmark" href="/products">
          Store
        </Link>
        <nav className="main-nav">
          <Link href="/products">Products</Link>
        </nav>
        <div className="header-actions">{user ? <><span className="header-user">{user.username}</span><button className="header-auth" onClick={() => { logout(); router.push("/products"); }}>Sign out</button></> : <Link className="header-auth" href="/login">Sign in</Link>}
        <Link
          className="cart-link"
          href={user ? "/cart" : "/login?next=%2Fcart"}
          aria-label={`Shopping cart, ${count} items`}
        >
          <span>Cart</span>
          <span className="cart-count">{count}</span>
        </Link>
        </div>
      </div>
    </header>
  );
}
