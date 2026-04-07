import { requireAdmin } from "@/lib/auth";
import { apifyMode } from "@/lib/apify";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const userCount = await prisma.user.count();
  const adminCount = await prisma.user.count({ where: { role: "admin" } });
  return (
    <div className="p-8 max-w-3xl">
      <span className="chip chip-sky">settings</span>
      <h1 className="font-display font-extrabold text-4xl md:text-5xl mt-3">Platform settings</h1>

      <div className="grid gap-4 mt-8">
        <Row label="Apify connection" value={apifyMode().toUpperCase()} chip={apifyMode() === "live" ? "chip-mint" : "chip-sun"} sub="set APIFY_TOKEN to go live" />
        <Row label="Database" value={dbKind()} chip="chip-lav" sub="set DATABASE_URL" />
        <Row label="Total users" value={String(userCount)} chip="chip-pink" />
        <Row label="Admin accounts" value={String(adminCount)} chip="chip-coral" />
        <Row label="Auth secret" value={process.env.AUTH_SECRET ? "configured" : "MISSING"} chip={process.env.AUTH_SECRET ? "chip-mint" : "chip-coral"} />
      </div>

      <div className="retro-card p-6 mt-8 bg-sunSoft">
        <h2 className="font-display font-extrabold text-xl">Environment</h2>
        <p className="text-sm text-ink2 mt-2">
          Edit <code>.env</code> (or your Railway variables) to change platform behavior. After
          changing API keys, restart the server.
        </p>
        <pre className="bg-white border-2 border-ink rounded-xl p-3 mt-3 text-xs font-mono overflow-x-auto">
{`DATABASE_URL=...
AUTH_SECRET=...
APIFY_TOKEN=...
APIFY_ACTOR_ID=code_crafter~leads-finder`}
        </pre>
      </div>
    </div>
  );
}

function Row({ label, value, sub, chip }: { label: string; value: string; sub?: string; chip: string }) {
  return (
    <div className="retro-card p-5 flex items-center justify-between">
      <div>
        <div className="font-display font-bold text-lg">{label}</div>
        {sub && <div className="text-xs text-ink3 font-mono mt-0.5">{sub}</div>}
      </div>
      <span className={`chip ${chip}`}>{value}</span>
    </div>
  );
}

function dbKind(): string {
  const url = process.env.DATABASE_URL ?? "";
  if (url.startsWith("file:")) return "SQLite";
  if (url.startsWith("postgres")) return "Postgres";
  if (url.startsWith("mysql")) return "MySQL";
  return "Unknown";
}
