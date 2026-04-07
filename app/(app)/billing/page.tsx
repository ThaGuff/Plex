import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PLANS, formatPrice } from "@/lib/plans";
import { ChangePlanButton } from "@/components/ChangePlanButton";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const user = await requireUser();
  const current = await prisma.plan.findUnique({ where: { id: user.planId } });
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const used = await prisma.search.count({
    where: { userId: user.id, createdAt: { gte: monthStart } },
  });
  const cap = current?.searchesPerMo ?? 0;
  const pct = cap === 0 ? 0 : Math.min(100, Math.round((used / cap) * 100));

  return (
    <div className="p-8 max-w-6xl">
      <span className="chip chip-peach">billing</span>
      <h1 className="font-display font-extrabold text-4xl md:text-5xl text-ink mt-3">
        Plan & billing
      </h1>

      {/* Current plan */}
      <div className="retro-card p-6 mt-8 bg-pinkSoft">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <span className="font-mono text-xs uppercase text-ink3">current plan</span>
            <div className="font-display font-extrabold text-4xl mt-1 capitalize">{current?.name ?? user.planId}</div>
            <div className="text-ink2 mt-1">{formatPrice(current?.priceCents ?? 0)} / month</div>
          </div>
          <div className="text-right">
            <span className="chip chip-mint">active</span>
            <div className="text-xs text-ink3 mt-2 font-mono">renews monthly</div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex justify-between text-sm font-mono mb-1">
            <span>{used} / {cap} searches used</span>
            <span>{pct}%</span>
          </div>
          <div className="w-full h-3 bg-white border-2 border-ink rounded-full overflow-hidden">
            <div className="h-full bg-pink" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Change plan */}
      <h2 className="font-display font-extrabold text-2xl mt-12">Change plan</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {PLANS.map((p) => {
          const active = p.id === user.planId;
          return (
            <div
              key={p.id}
              className={`retro-card p-5 ${active ? "bg-mintSoft" : ""}`}
            >
              <div className="font-mono text-xs uppercase text-ink3">{p.id}</div>
              <div className="font-display font-extrabold text-2xl">{p.name}</div>
              <div className="font-display font-extrabold text-3xl mt-2">{formatPrice(p.priceCents)}<span className="text-sm font-mono text-ink3"> /mo</span></div>
              <ul className="mt-3 space-y-1 text-xs">
                {p.features.slice(0, 4).map((f) => <li key={f}>✓ {f}</li>)}
              </ul>
              <ChangePlanButton planId={p.id} active={active} />
            </div>
          );
        })}
      </div>

      <div className="retro-card p-6 mt-12 bg-sunSoft">
        <h3 className="font-display font-extrabold text-xl">Mock billing</h3>
        <p className="text-ink2 mt-1 text-sm">
          This LeadLoop instance runs in <strong>mock billing</strong> mode. Plan changes apply
          instantly with no card. To wire a real Stripe checkout, set <code className="font-mono">STRIPE_SECRET_KEY</code> and
          implement <code className="font-mono">/api/billing/checkout</code>.
        </p>
      </div>
    </div>
  );
}
