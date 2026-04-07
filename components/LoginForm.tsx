"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({ endpoint }: { endpoint: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sign in failed");
        return;
      }
      router.push(data.redirect || "/dashboard");
      router.refresh();
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label">Email</label>
        <input
          type="email"
          required
          className="field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
        />
      </div>
      <div>
        <label className="label">Password</label>
        <input
          type="password"
          required
          className="field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>
      {error && (
        <div className="text-sm bg-coralSoft border-2 border-ink rounded-lg px-3 py-2 font-mono">
          {error}
        </div>
      )}
      <button type="submit" disabled={loading} className="btn btn-pink w-full justify-center">
        {loading ? "Signing in…" : "Sign in →"}
      </button>
    </form>
  );
}
