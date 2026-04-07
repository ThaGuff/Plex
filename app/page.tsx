import Link from "next/link";
import { MarketingNav } from "@/components/MarketingNav";
import { MarketingFooter } from "@/components/MarketingFooter";

export default function HomePage() {
  return (
    <>
      <MarketingNav />
      <main>
        {/* HERO */}
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7">
            <span className="sticker">live · pastel · retro</span>
            <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-[0.95] mt-5 text-ink">
              Find your next <span className="scribble-pink">1,000</span><br />
              customers in <span className="scribble-mint">60 seconds</span>.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-ink2 max-w-xl">
              LeadLoop wraps the Apify <strong>Leads Finder</strong> API into a friendly,
              pastel SaaS for sales teams. Filter, save, and export real prospects — without
              touching a CRM you hate.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="btn btn-pink">Start free → no card</Link>
              <Link href="/pricing" className="btn btn-mint">See pricing</Link>
              <Link href="/login" className="btn btn-ghost">Sign in</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              <span className="chip chip-pink">Pastel pop</span>
              <span className="chip chip-mint">CSV export</span>
              <span className="chip chip-lav">Save & tag leads</span>
              <span className="chip chip-peach">Pipeline stages</span>
              <span className="chip chip-sun">Admin console</span>
            </div>
          </div>

          {/* HERO CARD */}
          <div className="md:col-span-5">
            <div className="retro-card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="chip chip-mint">● live preview</span>
                <span className="font-mono text-xs text-ink3">apify · leads-finder</span>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Avery Hart", title: "Founder · Brightway Studios", chip: "chip-pink", score: 94 },
                  { name: "Leo Park", title: "Marketing · Crescent Roofing", chip: "chip-mint", score: 87 },
                  { name: "Mira Patel", title: "CEO · Hello Kombucha", chip: "chip-lav", score: 91 },
                  { name: "Sam Reyes", title: "Owner · Apex Plumbing", chip: "chip-peach", score: 78 },
                ].map((l) => (
                  <div key={l.name} className="flex items-center justify-between border-2 border-ink rounded-xl px-3 py-2 bg-cream">
                    <div>
                      <div className="font-bold">{l.name}</div>
                      <div className="text-xs text-ink3">{l.title}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`chip ${l.chip}`}>{l.score}</span>
                      <button className="btn btn-sm btn-ink">save</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="font-mono text-xs text-ink3">4 of 248 results</span>
                <span className="btn btn-sm btn-sun">Export CSV ↓</span>
              </div>
            </div>
            <div className="text-center mt-3 text-xs font-mono text-ink3">
              ✨ this is what your dashboard looks like
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF STRIP */}
        <section className="border-y-3 border-ink bg-sunSoft">
          <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap gap-x-8 gap-y-3 items-center justify-between">
            <span className="font-display font-bold text-ink">Trusted by friendly sales teams at</span>
            <div className="flex flex-wrap gap-x-7 gap-y-2 font-mono text-sm font-semibold text-ink2">
              <span>★ Brightway</span>
              <span>★ Hello Kombucha</span>
              <span>★ Northwind HVAC</span>
              <span>★ Forge Coffee</span>
              <span>★ Apex Plumbing</span>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center max-w-2xl mx-auto">
            <span className="chip chip-lav">features</span>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl mt-4 text-ink">
              Everything you need to close the lead.
            </h2>
            <p className="text-ink3 mt-4">
              Filter on 12+ dimensions, save what works, tag what matters,
              and export to your favorite outreach tool.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="retro-card p-6">
                <div className={`w-12 h-12 rounded-2xl border-3 border-ink flex items-center justify-center text-2xl mb-4 ${f.bg}`}>
                  {f.icon}
                </div>
                <div className="font-mono text-xs text-ink3">0{i + 1}</div>
                <h3 className="font-display font-bold text-xl mt-1">{f.title}</h3>
                <p className="text-ink3 text-sm mt-2">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="bg-bone border-y-3 border-ink py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="chip chip-mint">how it works</span>
              <h2 className="font-display font-extrabold text-4xl md:text-5xl mt-4 text-ink">
                Three steps. No CRM required.
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {STEPS.map((s, i) => (
                <div key={s.title} className="relative retro-card p-6">
                  <div className="absolute -top-5 -left-5 w-14 h-14 rounded-full bg-pink border-3 border-ink shadow-retro flex items-center justify-center font-display font-extrabold text-2xl text-white">
                    {i + 1}
                  </div>
                  <h3 className="font-display font-bold text-xl mt-3">{s.title}</h3>
                  <p className="text-ink3 text-sm mt-2">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h2 className="font-display font-extrabold text-4xl md:text-6xl text-ink">
            Ready to <span className="scribble-pink">loop</span> in your next 1,000 leads?
          </h2>
          <p className="text-ink3 mt-4 text-lg">Free forever plan. No credit card.</p>
          <div className="flex justify-center gap-3 mt-8">
            <Link href="/signup" className="btn btn-pink">Start free</Link>
            <Link href="/pricing" className="btn btn-mint">See pricing</Link>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}

const FEATURES = [
  {
    icon: "🔍",
    bg: "bg-pinkSoft",
    title: "12+ filter dimensions",
    body: "Industry, location, job title, employee count, revenue, contact info — drill down to exactly the leads that match your ICP.",
  },
  {
    icon: "💾",
    bg: "bg-mintSoft",
    title: "Save & pipeline",
    body: "One-click save. Tag, take notes, and move leads through New → Contacted → Qualified → Won.",
  },
  {
    icon: "📤",
    bg: "bg-lavenderSoft",
    title: "Export anywhere",
    body: "CSV exports of any search or your saved board. Works with Apollo, Outreach, HubSpot, Lemlist — any tool.",
  },
  {
    icon: "🧠",
    bg: "bg-peachSoft",
    title: "Search history",
    body: "Every search is logged with filters and result counts. Re-run, refine, or clone in one click.",
  },
  {
    icon: "🛡️",
    bg: "bg-sunSoft",
    title: "Admin console",
    body: "Manage users, plans, billing, and audit every search across your team — built right in.",
  },
  {
    icon: "🚀",
    bg: "bg-skySoft",
    title: "Apify-powered",
    body: "Real-time data from the Apify Leads Finder actor. Or run mock mode for demos and previews.",
  },
];

const STEPS = [
  { title: "Sign up free", body: "Create an account in 30 seconds. No credit card. Get 5 free searches every month." },
  { title: "Filter your ICP", body: "Pick industry, location, job title, employee size — we hit Apify and bring back matches in real-time." },
  { title: "Save & export", body: "Tag leads, write notes, push to CSV, and hand off to your outreach stack. Done." },
];
