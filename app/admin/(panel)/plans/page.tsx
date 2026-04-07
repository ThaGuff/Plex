import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/plans";

export const dynamic = "force-dynamic";

export default async function AdminPlansPage() {
  await requireAdmin();
  const plans = await prisma.plan.findMany({ orderBy: { sortOrder: "asc" } });
  const counts = await Promise.all(
    plans.map(async (p) => ({
      id: p.id,
      n: await prisma.user.count({ where: { planId: p.id } }),
    }))
  );

  return (
    <div className="p-8 max-w-6xl">
      <span className="chip chip-peach">plans</span>
      <h1 className="font-display font-extrabold text-4xl md:text-5xl mt-3">Plans & limits</h1>
      <p className="text-ink3 mt-2">Pricing and quota for each tier. (Edit in <code>lib/plans.ts</code>.)</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {plans.map((p) => {
          const features = JSON.parse(p.features) as string[];
          const userCount = counts.find((c) => c.id === p.id)?.n ?? 0;
          return (
            <div key={p.id} className={`retro-card p-5 ${p.highlight ? "bg-pinkSoft" : ""}`}>
              <div className="font-mono text-xs uppercase text-ink3">{p.id}</div>
              <div className="font-display font-extrabold text-2xl mt-1">{p.name}</div>
              <div className="font-display font-extrabold text-3xl mt-1">{formatPrice(p.priceCents)}<span className="text-sm font-mono text-ink3"> /mo</span></div>
              <div className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between"><span>Searches /mo</span><span className="font-mono">{p.searchesPerMo}</span></div>
                <div className="flex justify-between"><span>Exports /mo</span><span className="font-mono">{p.exportsPerMo}</span></div>
                <div className="flex justify-between"><span>Users on plan</span><span className="font-mono">{userCount}</span></div>
              </div>
              <ul className="mt-4 space-y-1 text-xs">
                {features.map((f) => <li key={f}>✓ {f}</li>)}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
