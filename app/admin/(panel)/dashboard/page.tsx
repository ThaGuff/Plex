import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { fmtDateTime, fmtNumber, fmtMoney } from "@/lib/utils";
import { apifyMode } from "@/lib/apify";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAdmin();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [
    userCount,
    paidUsers,
    searchesAll,
    searchesMonth,
    leadsTotal,
    savedTotal,
    recentSearches,
    plans,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { planId: { in: ["starter", "pro", "scale"] } } }),
    prisma.search.count(),
    prisma.search.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.lead.count(),
    prisma.savedLead.count(),
    prisma.search.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { user: true },
    }),
    prisma.plan.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  const planUserCounts = await Promise.all(
    plans.map(async (p) => ({
      id: p.id,
      name: p.name,
      count: await prisma.user.count({ where: { planId: p.id } }),
      priceCents: p.priceCents,
    }))
  );
  const mrrCents = planUserCounts.reduce((s, p) => s + p.priceCents * p.count, 0);

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <span className="chip chip-pink">admin</span>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl mt-3">Console</h1>
          <p className="text-ink3 mt-2">System health, usage, and revenue at a glance.</p>
        </div>
        <span className={`chip ${apifyMode() === "live" ? "chip-mint" : "chip-sun"}`}>
          ● apify · {apifyMode()}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <Stat label="Users" value={fmtNumber(userCount)} chip="chip-pink" sub={`${paidUsers} paying`} />
        <Stat label="MRR" value={fmtMoney(mrrCents)} chip="chip-mint" sub="mock revenue" />
        <Stat label="Searches (mo)" value={fmtNumber(searchesMonth)} chip="chip-lav" sub={`${fmtNumber(searchesAll)} all-time`} />
        <Stat label="Leads pulled" value={fmtNumber(leadsTotal)} chip="chip-peach" sub={`${fmtNumber(savedTotal)} saved`} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-10">
        <div className="lg:col-span-2 retro-card p-6">
          <h2 className="font-display font-extrabold text-2xl mb-4">Recent searches across all users</h2>
          <table className="tbl">
            <thead>
              <tr><th>When</th><th>User</th><th>Query</th><th>Source</th><th>Results</th></tr>
            </thead>
            <tbody>
              {recentSearches.map((s) => (
                <tr key={s.id}>
                  <td className="text-ink3 text-sm">{fmtDateTime(s.createdAt)}</td>
                  <td className="font-semibold">{s.user.email}</td>
                  <td>{s.query}</td>
                  <td><span className={`chip ${s.source === "apify" ? "chip-mint" : "chip-sun"}`}>{s.source}</span></td>
                  <td className="font-mono">{s.results}</td>
                </tr>
              ))}
              {recentSearches.length === 0 && (
                <tr><td colSpan={5} className="text-center text-ink3 py-6">No searches yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="retro-card p-6 bg-pinkSoft">
          <h2 className="font-display font-extrabold text-2xl">Plan distribution</h2>
          <div className="space-y-2 mt-4">
            {planUserCounts.map((p) => (
              <div key={p.id} className="flex items-center justify-between border-2 border-ink rounded-xl px-3 py-2 bg-white">
                <div>
                  <div className="font-bold capitalize">{p.name}</div>
                  <div className="text-xs text-ink3 font-mono">{p.id}</div>
                </div>
                <div className="text-right">
                  <div className="font-display font-extrabold text-xl">{p.count}</div>
                  <div className="text-xs text-ink3 font-mono">{fmtMoney(p.priceCents)}</div>
                </div>
              </div>
            ))}
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
      <div className="font-display font-extrabold text-3xl mt-3">{value}</div>
      {sub && <div className="text-xs text-ink3 mt-1 font-mono">{sub}</div>}
    </div>
  );
}
