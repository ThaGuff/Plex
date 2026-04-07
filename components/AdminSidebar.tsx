"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "◎" },
  { href: "/admin/users", label: "Users", icon: "◉" },
  { href: "/admin/searches", label: "Searches", icon: "✦" },
  { href: "/admin/plans", label: "Plans", icon: "◆" },
  { href: "/admin/settings", label: "Settings", icon: "⚙" },
];

export function AdminSidebar({
  user,
}: {
  user: { name: string | null; email: string };
}) {
  const path = usePathname();
  return (
    <aside className="w-64 bg-ink text-cream min-h-screen flex flex-col border-r-3 border-ink">
      <div className="p-5 border-b-3 border-cream/20">
        <div className="flex items-center gap-2">
          <Logo size="sm" />
          <span className="chip chip-pink ml-1">admin</span>
        </div>
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
                  ? "bg-pink text-white border-cream"
                  : "border-transparent hover:bg-cream/10 hover:border-cream/40"
              }`}
            >
              <span className="font-mono text-lg w-5 text-center">{n.icon}</span>
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t-3 border-cream/20 space-y-2">
        <div className="border-2 border-cream rounded-xl p-3 bg-cream/5">
          <div className="font-mono text-[10px] uppercase text-cream/60">Admin</div>
          <div className="text-sm font-bold truncate">{user.name ?? user.email}</div>
          <div className="text-xs text-cream/60 truncate">{user.email}</div>
        </div>
        <a href="/api/auth/logout" className="btn btn-sm btn-pink w-full justify-center">Sign out</a>
      </div>
    </aside>
  );
}
