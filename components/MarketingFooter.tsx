import Link from "next/link";
import { Logo } from "./Logo";

export function MarketingFooter() {
  return (
    <footer className="border-t-3 border-ink bg-bone mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-3 text-sm text-ink3 max-w-sm">
            LeadLoop turns the Apify Leads Finder API into a friendly pastel SaaS for sales teams who hate ugly CRMs.
          </p>
        </div>
        <div>
          <div className="font-mono text-xs uppercase tracking-wider text-ink3 mb-3">Product</div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/#features">Features</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/signup">Sign up</Link></li>
            <li><Link href="/login">Sign in</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-mono text-xs uppercase tracking-wider text-ink3 mb-3">Company</div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/admin/login">Admin portal</Link></li>
            <li><a href="https://apify.com/code_crafter/leads-finder?fpr=p2hrc6" target="_blank" rel="noreferrer">Powered by Apify</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t-2 border-ink/20">
        <div className="max-w-6xl mx-auto px-6 py-4 text-xs font-mono text-ink3 flex justify-between">
          <span>© LeadLoop 2026</span>
          <span>made with pastel love</span>
        </div>
      </div>
    </footer>
  );
}
