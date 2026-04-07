"use client";

import { useState } from "react";

type Lead = {
  id: string;
  name: string | null;
  title: string | null;
  company: string | null;
  industry: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  facebookUrl: string | null;
  employees: string | null;
  revenue: string | null;
  description: string | null;
  tags: string | null;
  score: number;
};

const INDUSTRIES = [
  "", "Home Services","Hospitality","Retail","Health & Wellness","Professional Services",
  "Automotive","Real Estate","Food & Beverage","Fitness","Beauty","Technology","Legal",
  "Financial","Construction","Education","Non-Profit",
];

const TITLES = [
  "", "Founder & CEO","Owner","VP of Sales","Marketing Manager","Director of Operations",
  "Account Executive","Growth Lead","CRO","Co-Founder",
];

export function SearchClient() {
  const [filters, setFilters] = useState({
    keyword: "",
    industry: "",
    location: "",
    jobTitle: "",
    minEmployees: "",
    maxEmployees: "",
    hasEmail: true,
    hasPhone: false,
    limit: 25,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchId, setSearchId] = useState<string | null>(null);
  const [source, setSource] = useState<"apify" | "mock" | null>(null);
  const [savedSet, setSavedSet] = useState<Set<string>>(new Set());
  const [openLead, setOpenLead] = useState<Lead | null>(null);

  async function run(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/leads/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Search failed");
        setLeads([]);
        return;
      }
      setLeads(data.leads);
      setSearchId(data.searchId);
      setSource(data.source);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function save(lead: Lead) {
    setSavedSet((s) => new Set(s).add(lead.id));
    await fetch("/api/leads/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: lead.id }),
    });
  }

  function exportCsv() {
    if (!searchId) return;
    window.location.href = `/api/leads/export?searchId=${searchId}`;
  }

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      {/* Filter rail */}
      <aside className="lg:col-span-4 retro-card p-5 h-fit lg:sticky lg:top-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-extrabold text-xl">Filters</h2>
          <span className="chip chip-lav">12 dims</span>
        </div>
        <form onSubmit={run} className="space-y-4">
          <div>
            <label className="label">Keyword</label>
            <input className="field" placeholder="solar, hvac, bakery…"
              value={filters.keyword}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })} />
          </div>
          <div>
            <label className="label">Industry</label>
            <select className="field" value={filters.industry}
              onChange={(e) => setFilters({ ...filters, industry: e.target.value })}>
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i || "Any"}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Location</label>
            <input className="field" placeholder="Birmingham, AL"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
          </div>
          <div>
            <label className="label">Job title</label>
            <select className="field" value={filters.jobTitle}
              onChange={(e) => setFilters({ ...filters, jobTitle: e.target.value })}>
              {TITLES.map((t) => <option key={t} value={t}>{t || "Any"}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Min employees</label>
              <input type="number" className="field" placeholder="0"
                value={filters.minEmployees}
                onChange={(e) => setFilters({ ...filters, minEmployees: e.target.value })} />
            </div>
            <div>
              <label className="label">Max employees</label>
              <input type="number" className="field" placeholder="500"
                value={filters.maxEmployees}
                onChange={(e) => setFilters({ ...filters, maxEmployees: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={filters.hasEmail}
                onChange={(e) => setFilters({ ...filters, hasEmail: e.target.checked })} />
              Require verified email
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={filters.hasPhone}
                onChange={(e) => setFilters({ ...filters, hasPhone: e.target.checked })} />
              Require phone number
            </label>
          </div>
          <div>
            <label className="label">Result count: {filters.limit}</label>
            <input type="range" min={5} max={100} step={5}
              value={filters.limit}
              onChange={(e) => setFilters({ ...filters, limit: Number(e.target.value) })}
              className="w-full accent-pink" />
          </div>
          <button type="submit" disabled={loading} className="btn btn-pink w-full justify-center">
            {loading ? "Searching…" : "Find leads →"}
          </button>
          {error && (
            <div className="text-sm bg-coralSoft border-2 border-ink rounded-lg px-3 py-2 font-mono">
              {error}
            </div>
          )}
        </form>
      </aside>

      {/* Results */}
      <section className="lg:col-span-8">
        {leads.length === 0 && !loading ? (
          <div className="retro-card p-10 text-center bg-pinkSoft">
            <div className="text-4xl">✦</div>
            <div className="font-display font-extrabold text-2xl mt-2">No results yet</div>
            <p className="text-ink2 mt-1">Set your filters on the left and hit <strong>Find leads</strong>.</p>
          </div>
        ) : null}

        {loading && (
          <div className="retro-card p-10 text-center">
            <div className="font-display font-bold text-xl animate-pulseDot">Searching the loop…</div>
          </div>
        )}

        {leads.length > 0 && !loading && (
          <>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="chip chip-mint">{leads.length} results</span>
                {source && <span className={`chip ${source === "apify" ? "chip-lav" : "chip-sun"}`}>source · {source}</span>}
              </div>
              <button onClick={exportCsv} className="btn btn-sm btn-sun">Export CSV ↓</button>
            </div>
            <div className="space-y-3">
              {leads.map((l) => (
                <div key={l.id} className="retro-card-sm p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => setOpenLead(l)}
                          className="font-display font-extrabold text-lg text-left hover:text-pink"
                        >
                          {l.name ?? "Unknown"}
                        </button>
                        <span className="chip chip-sun">{l.score}</span>
                      </div>
                      <div className="text-sm text-ink2 mt-0.5 truncate">
                        {l.title} · <strong>{l.company}</strong>
                      </div>
                      <div className="text-xs text-ink3 mt-1 flex flex-wrap gap-x-3">
                        {l.industry && <span>◆ {l.industry}</span>}
                        {l.location && <span>◎ {l.location}</span>}
                        {l.employees && <span>👥 {l.employees}</span>}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        {l.email && <a href={`mailto:${l.email}`} className="chip chip-pink">{l.email}</a>}
                        {l.phone && <a href={`tel:${l.phone}`} className="chip chip-mint">{l.phone}</a>}
                        {l.website && <a href={l.website} target="_blank" rel="noreferrer" className="chip chip-lav">website ↗</a>}
                        {l.linkedinUrl && <a href={l.linkedinUrl} target="_blank" rel="noreferrer" className="chip chip-sky">linkedin ↗</a>}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button onClick={() => setOpenLead(l)} className="btn btn-sm btn-ink">View</button>
                      <button
                        onClick={() => save(l)}
                        disabled={savedSet.has(l.id)}
                        className={`btn btn-sm ${savedSet.has(l.id) ? "btn-mint" : "btn-pink"}`}
                      >
                        {savedSet.has(l.id) ? "Saved ✓" : "Save ♥"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {openLead && (
        <LeadModal
          lead={openLead}
          onClose={() => setOpenLead(null)}
          onSave={() => save(openLead)}
          isSaved={savedSet.has(openLead.id)}
        />
      )}
    </div>
  );
}

function LeadModal({
  lead,
  onClose,
  onSave,
  isSaved,
}: {
  lead: Lead;
  onClose: () => void;
  onSave: () => void;
  isSaved: boolean;
}) {
  const tags: string[] = lead.tags ? safeParse(lead.tags) : [];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40" onClick={onClose}>
      <div className="retro-card max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b-3 border-ink bg-pinkSoft flex items-start justify-between gap-4">
          <div>
            <span className="chip chip-mint">{lead.score} fit score</span>
            <h3 className="font-display font-extrabold text-3xl mt-2">{lead.name}</h3>
            <p className="text-ink2 mt-1">{lead.title} · <strong>{lead.company}</strong></p>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-ghost">✕</button>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Field label="Industry" value={lead.industry} />
            <Field label="Location" value={lead.location} />
            <Field label="Employees" value={lead.employees} />
            <Field label="Revenue" value={lead.revenue} />
          </div>
          <div>
            <div className="label">Contact</div>
            <div className="grid sm:grid-cols-2 gap-2">
              {lead.email && <a href={`mailto:${lead.email}`} className="btn btn-sm btn-pink justify-center">✉ {lead.email}</a>}
              {lead.phone && <a href={`tel:${lead.phone}`} className="btn btn-sm btn-mint justify-center">📞 {lead.phone}</a>}
              {lead.website && <a href={lead.website} target="_blank" rel="noreferrer" className="btn btn-sm btn-lav justify-center">🌐 Website</a>}
              {lead.linkedinUrl && <a href={lead.linkedinUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-sun justify-center">in LinkedIn</a>}
              {lead.twitterUrl && <a href={lead.twitterUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-peach justify-center">𝕏 Twitter</a>}
              {lead.facebookUrl && <a href={lead.facebookUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-ghost justify-center">f Facebook</a>}
            </div>
          </div>
          {lead.description && (
            <div>
              <div className="label">About</div>
              <p className="text-sm text-ink2">{lead.description}</p>
            </div>
          )}
          {tags.length > 0 && (
            <div>
              <div className="label">Tags</div>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => <span key={t} className="chip chip-sky">{t}</span>)}
              </div>
            </div>
          )}
        </div>
        <div className="p-5 border-t-3 border-ink flex justify-end gap-2 bg-cream">
          <button onClick={onClose} className="btn btn-sm btn-ghost">Close</button>
          <button onClick={onSave} disabled={isSaved} className={`btn btn-sm ${isSaved ? "btn-mint" : "btn-pink"}`}>
            {isSaved ? "Saved ✓" : "Save lead ♥"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="border-2 border-ink rounded-xl p-3 bg-cream">
      <div className="font-mono text-[10px] uppercase text-ink3">{label}</div>
      <div className="font-bold mt-0.5">{value || "—"}</div>
    </div>
  );
}

function safeParse(s: string): string[] {
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
