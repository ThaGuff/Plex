import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { fmtDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const user = await requireUser();
  const searches = await prisma.search.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="p-8 max-w-6xl">
      <span className="chip chip-lav">history</span>
      <h1 className="font-display font-extrabold text-4xl md:text-5xl text-ink mt-3">
        Search history
      </h1>
      <p className="text-ink3 mt-2">Your last 100 searches.</p>

      <div className="retro-card mt-8 overflow-hidden">
        {searches.length === 0 ? (
          <div className="p-12 text-center">
            <div className="font-display font-bold text-xl">No searches yet.</div>
            <a href="/search" className="btn btn-pink mt-4">Run your first search →</a>
          </div>
        ) : (
          <table className="tbl">
            <thead>
              <tr><th>When</th><th>Query</th><th>Source</th><th>Results</th><th>Export</th></tr>
            </thead>
            <tbody>
              {searches.map((s) => (
                <tr key={s.id}>
                  <td className="text-ink3 text-sm">{fmtDateTime(s.createdAt)}</td>
                  <td className="font-semibold">{s.query}</td>
                  <td><span className={`chip ${s.source === "apify" ? "chip-mint" : "chip-sun"}`}>{s.source}</span></td>
                  <td className="font-mono">{s.results}</td>
                  <td>
                    <a href={`/api/leads/export?searchId=${s.id}`} className="btn btn-sm btn-sun">CSV ↓</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
