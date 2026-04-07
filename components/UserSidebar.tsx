"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "◎" },
  { href: "/search", label: "Search Leads", icon: "✦" },
  { href: "/leads", label: "Saved Leads", icon: "♥" },
  { href: "/history", label: "History", icon: "◷" },
  { href: "/billing", label: "Billing", icon: "$" },
  { href: "/settings", label: "Settings", icon: "⚙" },
];

export function UserSidebar({
  user,
}: {
  user: { name: string | null; email: string; planId: string };
}) {
  const path = usePathname();
  return (
    <aside className="w-64 bg-cream border-r-3 border-ink min-h-screen flex flex-col">
      <div className="p-5 border-b-3 border-ink">
        <Logo />
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map((n) => {
          const active = path === n.href || path.startsWith(n.href + "/");
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl border-2 font-semibold text-sm transition ${
                active
                  ? "bg-pink text-white border-ink shadow-[3px_3px_0_0_#241638]"
                  : "border-transparent hover:border-ink hover:bg-pinkSoft"
              }`}
            >
              <span className="font-mono text-lg w-5 text-center">{n.icon}</span>
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t-3 border-ink space-y-2">
        <div className="retro-card-sm p-3">
          <div className="font-mono text-[10px] uppercase text-ink3">Plan</div>
          <div className="font-display font-bold text-lg capitalize">{user.planId}</div>
          <Link href="/billing" className="btn btn-sm btn-mint w-full justify-center mt-2">Upgrade</Link>
        </div>
        <div className="retro-card-sm p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-lavenderSoft border-2 border-ink flex items-center justify-center font-bold">
            {(user.name?.[0] ?? user.email[0]).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-sm truncate">{user.name ?? user.email.split("@")[0]}</div>
            <div className="text-xs text-ink3 truncate">{user.email}</div>
          </div>
        </div>
        <a href="/api/auth/logout" className="btn btn-sm btn-ghost w-full justify-center">Sign out</a>
      </div>
    </aside>
  );
}
