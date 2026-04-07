"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SettingsForm({
  name,
  company,
  email,
}: {
  name: string;
  company: string;
  email: string;
}) {
  const router = useRouter();
  const [n, setN] = useState(name);
  const [c, setC] = useState(company);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: n, company: c }),
    });
    setBusy(false);
    if (res.ok) {
      setMsg("Saved ✓");
      router.refresh();
    } else {
      setMsg("Save failed");
    }
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <div>
        <label className="label">Email</label>
        <input className="field opacity-70" value={email} disabled />
      </div>
      <div>
        <label className="label">Name</label>
        <input className="field" value={n} onChange={(e) => setN(e.target.value)} />
      </div>
      <div>
        <label className="label">Company</label>
        <input className="field" value={c} onChange={(e) => setC(e.target.value)} />
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={busy} className="btn btn-pink">{busy ? "Saving…" : "Save"}</button>
        {msg && <span className="text-sm font-mono">{msg}</span>}
      </div>
    </form>
  );
}
