"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STAGES = ["new", "contacted", "qualified", "won", "lost"] as const;
type Stage = (typeof STAGES)[number];

export function LeadStatusSelect({ id, status }: { id: string; status: Stage }) {
  const [value, setValue] = useState<Stage>(status);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function update(next: Stage) {
    setValue(next);
    setBusy(true);
    await fetch("/api/leads/save", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: next }),
    });
    router.refresh();
    setBusy(false);
  }
  return (
    <select
      value={value}
      disabled={busy}
      onChange={(e) => update(e.target.value as Stage)}
      className="text-[10px] font-mono uppercase border-2 border-ink rounded-md px-1 py-0.5 bg-white"
    >
      {STAGES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
