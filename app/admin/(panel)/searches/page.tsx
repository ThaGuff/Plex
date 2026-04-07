import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { fmtDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminSearchesPage() {
  await requireAdmin();
  const searches = await prisma.search.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { user: true },
  });
  return (
    <div className="p-8 max-w-7xl">
      <span className="chip chip-lav">audit</span>
      <h1 className="font-display font-extrabold text-4xl md:text-5xl mt-3">Search audit log</h1>
      <p className="text-ink3 mt-2">Last 200 searches across all users.</p>

      <div className="retro-card mt-8 overflow-hidden">
        <table className="tbl">
          <thead>
            <tr><th>When</th><th>User</th><th>Query</th><th>Filters</th><th>Source</th><th>Results</th></tr>
          </thead>
          <tbody>
            {searches.map((s) => {
              const f = safeJson(s.filters);
              return (
                <tr key={s.id}>
                  <td className="text-ink3 text-xs">{fmtDateTime(s.createdAt)}</td>
                  <td>
                    <div className="font-semibold">{s.user.email}</div>
                    <div className="text-xs text-ink3 capitalize">{s.user.planId}</div>
                  </td>
                  <td className="font-semibold">{s.query}</td>
                  <td className="font-mono text-xs text-ink3 max-w-xs truncate">{Object.entries(f).filter(([,v])=>v!==undefined&&v!=="").map(([k,v])=>`${k}=${v}`).join(" · ") || "—"}</td>
                  <td><span className={`chip ${s.source === "apify" ? "chip-mint" : "chip-sun"}`}>{s.source}</span></td>
                  <td className="font-mono">{s.results}</td>
                </tr>
              );
            })}
            {searches.length === 0 && (
              <tr><td colSpan={6} className="text-center text-ink3 py-6">No searches yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function safeJson(s: string): Record<string, unknown> {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
