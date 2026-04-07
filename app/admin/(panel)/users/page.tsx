import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { fmtDateTime } from "@/lib/utils";
import { UserActions } from "@/components/admin/UserActions";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await requireAdmin();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { searches: true, savedLeads: true } },
      plan: true,
    },
  });

  return (
    <div className="p-8 max-w-7xl">
      <span className="chip chip-mint">users</span>
      <h1 className="font-display font-extrabold text-4xl md:text-5xl mt-3">User management</h1>
      <p className="text-ink3 mt-2">{users.length} users · suspend, change plan, or delete.</p>

      <div className="retro-card mt-8 overflow-hidden">
        <table className="tbl">
          <thead>
            <tr>
              <th>User</th>
              <th>Plan</th>
              <th>Role</th>
              <th>Status</th>
              <th>Searches</th>
              <th>Saved</th>
              <th>Joined</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="font-semibold">{u.name ?? u.email.split("@")[0]}</div>
                  <div className="text-xs text-ink3">{u.email}</div>
                  {u.company && <div className="text-xs text-ink3">{u.company}</div>}
                </td>
                <td><span className="chip chip-pink capitalize">{u.plan.name}</span></td>
                <td><span className={`chip ${u.role === "admin" ? "chip-coral" : "chip-lav"}`}>{u.role}</span></td>
                <td><span className={`chip ${u.status === "active" ? "chip-mint" : "chip-coral"}`}>{u.status}</span></td>
                <td className="font-mono">{u._count.searches}</td>
                <td className="font-mono">{u._count.savedLeads}</td>
                <td className="text-xs text-ink3">{fmtDateTime(u.createdAt)}</td>
                <td><UserActions userId={u.id} status={u.status} planId={u.planId} role={u.role} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
