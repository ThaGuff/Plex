"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SignupForm({ defaultPlan = "free" }: { defaultPlan?: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [planId, setPlanId] = useState(defaultPlan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, email, password, planId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sign up failed");
        return;
      }
      router.push(data.redirect || "/dashboard");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Name</label>
          <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Avery Hart" />
        </div>
        <div>
          <label className="label">Company</label>
          <input className="field" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Brightway" />
        </div>
      </div>
      <div>
        <label className="label">Work email</label>
        <input type="email" required className="field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
      </div>
      <div>
        <label className="label">Password</label>
        <input type="password" required minLength={6} className="field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6+ characters" />
      </div>
      <div>
        <label className="label">Plan</label>
        <select className="field" value={planId} onChange={(e) => setPlanId(e.target.value)}>
          <option value="free">Free — $0</option>
          <option value="starter">Starter — $29</option>
          <option value="pro">Pro — $79</option>
          <option value="scale">Scale — $199</option>
        </select>
      </div>
      {error && (
        <div className="text-sm bg-coralSoft border-2 border-ink rounded-lg px-3 py-2 font-mono">
          {error}
        </div>
      )}
      <button type="submit" disabled={loading} className="btn btn-mint w-full justify-center">
        {loading ? "Creating account…" : "Create my account →"}
      </button>
    </form>
  );
}
