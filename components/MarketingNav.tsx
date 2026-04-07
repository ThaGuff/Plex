import Link from "next/link";
import { Logo } from "./Logo";

export function MarketingNav() {
  return (
    <header className="w-full border-b-3 border-ink bg-cream/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold">
          <Link href="/#features" className="hover:text-pink">Features</Link>
          <Link href="/#how" className="hover:text-pink">How it works</Link>
          <Link href="/pricing" className="hover:text-pink">Pricing</Link>
          <Link href="/admin/login" className="hover:text-pink text-ink3">Admin</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn btn-sm btn-ghost">Sign in</Link>
          <Link href="/signup" className="btn btn-sm btn-pink">Start free →</Link>
        </div>
      </div>
    </header>
  );
}
