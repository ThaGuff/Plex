"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ChangePlanButton({ planId, active }: { planId: string; active: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function change() {
    if (active) return;
    setBusy(true);
    const res = await fetch("/api/billing/change-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    });
    if (res.ok) {
      router.refresh();
    }
    setBusy(false);
  }
  return (
    <button
      disabled={active || busy}
      onClick={change}
      className={`btn btn-sm w-full justify-center mt-4 ${active ? "btn-mint" : "btn-pink"}`}
    >
      {active ? "Current ✓" : busy ? "Switching…" : "Switch"}
    </button>
  );
}
