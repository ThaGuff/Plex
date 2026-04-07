import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LoginForm } from "@/components/LoginForm";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const errorMsg =
    searchParams?.error === "forbidden"
      ? "Your account doesn't have admin access."
      : null;
  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-1/2 bg-ink text-white p-12 flex-col justify-between border-r-3 border-ink">
        <Logo />
        <div>
          <span className="sticker">restricted area</span>
          <h1 className="font-display font-extrabold text-5xl leading-tight mt-5">
            Admin <br />Console.
          </h1>
          <p className="mt-5 text-cream/80 max-w-md">
            Manage users, plans, billing, audit searches, and configure the platform.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
            {[
              "User management",
              "Plan / billing",
              "Search audit",
              "API key health",
            ].map((b) => (
              <div key={b} className="bg-white text-ink border-2 border-cream rounded-xl px-3 py-2 font-semibold">
                ◆ {b}
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs font-mono text-cream/50">© LeadLoop 2026 · admin v0.1</div>
      </aside>

      <main className="flex-1 flex items-center justify-center p-8 bg-cream">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-8"><Logo /></div>
          <h2 className="font-display font-extrabold text-3xl text-ink">Admin Sign In</h2>
          <p className="text-ink3 text-sm mt-1">Restricted to admin accounts.</p>
          {errorMsg && (
            <div className="mt-4 text-sm bg-coralSoft border-2 border-ink rounded-lg px-3 py-2 font-mono">
              {errorMsg}
            </div>
          )}
          <div className="retro-card p-6 mt-6">
            <LoginForm endpoint="/api/auth/admin-login" />
          </div>
          <div className="mt-4 text-xs text-ink3 font-mono text-center">
            Default: <strong>admin@leadloop.dev</strong> / <strong>admin1234</strong>
          </div>
          <div className="mt-6 text-sm text-center text-ink3">
            <Link href="/login" className="underline">← Back to user sign in</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
