import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { fmtDateTime, fmtNumber } from "@/lib/utils";
import { apifyMode } from "@/lib/apify";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [plan, searches, savedCount, leadCount, recent] = await Promise.all([
    prisma.plan.findUnique({ where: { id: user.planId } }),
    prisma.search.count({ where: { userId: user.id, createdAt: { gte: monthStart } } }),
    prisma.savedLead.count({ where: { userId: user.id } }),
    prisma.lead.count({ where: { search: { userId: user.id } } }),
    prisma.search.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const used = searches;
  const cap = plan?.searchesPerMo ?? 0;
  const remaining = Math.max(cap - used, 0);
  const mode = apifyMode();

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <span className="chip chip-mint">dashboard</span>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-ink mt-3">
            Hey {user.name?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="text-ink3 mt-2">Here&apos;s your loop today.</p>
        </div>
        <div className="flex gap-2">
          <span className={`chip ${mode === "live" ? "chip-mint" : "chip-sun"}`}>
            <span className="w-2 h-2 rounded-full bg-ink animate-pulseDot" />
            apify · {mode}
          </span>
          <Link href="/search" className="btn btn-pink">New search →</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <Stat label="Plan" value={user.planId} chip="chip-pink" />
        <Stat label="Searches this month" value={`${used} / ${cap}`} chip="chip-mint" sub={`${remaining} remaining`} />
        <Stat label="Saved leads" value={fmtNumber(savedCount)} chip="chip-lav" />
        <Stat label="Total leads pulled" value={fmtNumber(leadCount)} chip="chip-peach" />
      </div>

      {/* Quick start */}
      <div className="mt-10 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 retro-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-extrabold text-2xl">Recent searches</h2>
            <Link href="/history" className="btn btn-sm btn-ghost">See all →</Link>
          </div>
          {recent.length === 0 ? (
            <div className="border-3 border-dashed border-ink rounded-xl p-8 text-center bg-cream">
              <div className="font-display font-bold text-xl">No searches yet.</div>
              <p className="text-ink3 mt-1">Run your first search and we&apos;ll save it here.</p>
              <Link href="/search" className="btn btn-pink mt-4">Find leads →</Link>
            </div>
          ) : (
            <table className="tbl">
              <thead>
                <tr><th>Query</th><th>Source</th><th>Results</th><th>When</th></tr>
              </thead>
              <tbody>
                {recent.map((s) => (
                  <tr key={s.id}>
                    <td className="font-semibold">{s.query}</td>
                    <td><span className={`chip ${s.source === "apify" ? "chip-mint" : "chip-sun"}`}>{s.source}</span></td>
                    <td className="font-mono">{s.results}</td>
                    <td className="text-ink3 text-sm">{fmtDateTime(s.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="retro-card p-6 bg-sunSoft">
          <h2 className="font-display font-extrabold text-2xl">Pro tip</h2>
          <p className="text-ink2 mt-2 text-sm">
            Combine an industry with a city + job title to triple your reply rate.
            Try <em>“HVAC + Birmingham + Owner”</em>.
          </p>
          <Link href="/search" className="btn btn-mint mt-4">Try it</Link>

          <div className="mt-6 pt-6 border-t-2 border-ink/20">
            <h3 className="font-display font-bold text-lg">Apify status</h3>
            <p className="text-ink3 text-sm mt-1">
              {mode === "live"
                ? "Connected to live Apify Leads Finder."
                : "No APIFY_TOKEN set — running in mock mode. Add your token in .env to go live."}
            </p>
            <a
              href="https://apify.com/code_crafter/leads-finder?fpr=p2hrc6"
              target="_blank" rel="noreferrer"
              className="btn btn-sm btn-ink mt-3"
            >
              Get API token →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, sub, chip }: { label: string; value: string; sub?: string; chip: string }) {
  return (
    <div className="retro-card p-5">
      <span className={`chip ${chip}`}>{label}</span>
      <div className="font-display font-extrabold text-3xl mt-3 capitalize">{value}</div>
      {sub && <div className="text-xs text-ink3 mt-1 font-mono">{sub}</div>}
    </div>
  );
}
