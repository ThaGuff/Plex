import Link from "next/link";
import { MarketingNav } from "@/components/MarketingNav";
import { MarketingFooter } from "@/components/MarketingFooter";
import { PLANS, formatPrice } from "@/lib/plans";

export default function PricingPage() {
  return (
    <>
      <MarketingNav />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="sticker">simple · honest · pastel</span>
          <h1 className="font-display font-extrabold text-5xl md:text-6xl mt-5 text-ink">
            Pricing that <span className="scribble-pink">grows</span> with you.
          </h1>
          <p className="text-ink3 mt-4 text-lg">
            Start free. Upgrade when you need more searches or seats. Cancel any time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={`retro-card p-6 relative ${p.highlight ? "bg-pinkSoft" : ""}`}
            >
              {p.highlight && (
                <span className="sticker absolute -top-4 left-1/2 -translate-x-1/2">most loved</span>
              )}
              <div className="font-mono text-xs uppercase tracking-wider text-ink3">{p.id}</div>
              <h3 className="font-display font-extrabold text-3xl mt-1">{p.name}</h3>
              <div className="font-display font-extrabold text-5xl mt-4 text-ink">
                {formatPrice(p.priceCents)}
                <span className="text-base font-mono text-ink3"> /mo</span>
              </div>
              <ul className="mt-5 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-pink font-bold">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/signup?plan=${p.id}`}
                className={`btn w-full justify-center mt-6 ${
                  p.highlight ? "btn-pink" : p.id === "free" ? "btn-mint" : "btn-ink"
                }`}
              >
                {p.id === "free" ? "Start free" : `Choose ${p.name}`}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 retro-card p-8 text-center bg-sunSoft">
          <h3 className="font-display font-extrabold text-3xl">Need more than Scale?</h3>
          <p className="text-ink2 mt-2">
            Talk to us about custom volume, dedicated infrastructure, and white-label options.
          </p>
          <Link href="/signup" className="btn btn-ink mt-4">Get in touch</Link>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
