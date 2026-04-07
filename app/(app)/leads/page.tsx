import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { fmtDate } from "@/lib/utils";
import { LeadStatusSelect } from "@/components/LeadStatusSelect";

export const dynamic = "force-dynamic";

const STAGES = ["new", "contacted", "qualified", "won", "lost"] as const;

export default async function SavedLeadsPage() {
  const user = await requireUser();
  const saved = await prisma.savedLead.findMany({
    where: { userId: user.id },
    include: { lead: true },
    orderBy: { createdAt: "desc" },
  });

  const grouped = STAGES.map((stage) => ({
    stage,
    leads: saved.filter((s) => s.status === stage),
  }));

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <span className="chip chip-mint">saved leads</span>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-ink mt-3">
            Your pipeline.
          </h1>
          <p className="text-ink3 mt-2">{saved.length} saved · move them through the stages.</p>
        </div>
        {saved.length > 0 && (
          <a href="/api/leads/export?scope=saved" className="btn btn-sun">Export all CSV ↓</a>
        )}
      </div>

      {saved.length === 0 ? (
        <div className="retro-card p-12 text-center mt-8 bg-pinkSoft">
          <div className="text-5xl">♥</div>
          <div className="font-display font-extrabold text-2xl mt-2">No saved leads yet</div>
          <p className="text-ink2 mt-1">Save leads from your search to start building your pipeline.</p>
          <a href="/search" className="btn btn-pink mt-4">Find leads →</a>
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-4 mt-8">
          {grouped.map(({ stage, leads }) => (
            <div key={stage} className="retro-card p-3 bg-cream min-h-[300px]">
              <div className="flex items-center justify-between px-1 mb-3">
                <span className={`chip chip-${stageColor(stage)}`}>{stage}</span>
                <span className="font-mono text-xs text-ink3">{leads.length}</span>
              </div>
              <div className="space-y-2">
                {leads.map((s) => (
                  <div key={s.id} className="border-2 border-ink rounded-xl p-3 bg-white">
                    <div className="font-bold text-sm">{s.lead.name}</div>
                    <div className="text-xs text-ink3 mt-0.5">{s.lead.title}</div>
                    <div className="text-xs text-ink3">{s.lead.company}</div>
                    {s.lead.email && (
                      <a href={`mailto:${s.lead.email}`} className="text-xs text-pink underline block mt-1 truncate">
                        {s.lead.email}
                      </a>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-ink3">{fmtDate(s.createdAt)}</span>
                      <LeadStatusSelect id={s.id} status={s.status as typeof STAGES[number]} />
                    </div>
                  </div>
                ))}
                {leads.length === 0 && (
                  <div className="border-2 border-dashed border-ink/30 rounded-xl p-4 text-center text-xs text-ink3">
                    Empty
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function stageColor(s: string): string {
  switch (s) {
    case "new": return "lav";
    case "contacted": return "sky";
    case "qualified": return "sun";
    case "won": return "mint";
    case "lost": return "coral";
    default: return "lav";
  }
}
