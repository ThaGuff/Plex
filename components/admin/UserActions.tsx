"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PLANS = ["free", "starter", "pro", "scale"];

export function UserActions({
  userId,
  status,
  planId,
  role,
}: {
  userId: string;
  status: string;
  planId: string;
  role: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function call(body: object) {
    setBusy(true);
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...body }),
    });
    setBusy(false);
    router.refresh();
  }

  async function del() {
    if (!confirm("Permanently delete this user?")) return;
    setBusy(true);
    await fetch(`/api/admin/users?userId=${userId}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1">
      <select
        defaultValue={planId}
        disabled={busy}
        onChange={(e) => call({ planId: e.target.value })}
        className="text-xs border-2 border-ink rounded-md px-1 py-0.5 bg-white"
      >
        {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
      <button
        disabled={busy}
        onClick={() => call({ status: status === "active" ? "suspended" : "active" })}
        className={`btn btn-sm ${status === "active" ? "btn-sun" : "btn-mint"}`}
      >
        {status === "active" ? "Suspend" : "Activate"}
      </button>
      {role !== "admin" && (
        <button disabled={busy} onClick={del} className="btn btn-sm btn-ink">×</button>
      )}
    </div>
  );
}
