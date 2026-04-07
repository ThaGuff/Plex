import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SignupForm } from "@/components/SignupForm";

export default function SignupPage({
  searchParams,
}: {
  searchParams: { plan?: string };
}) {
  const plan = searchParams?.plan ?? "free";
  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-1/2 bg-mintSoft border-r-3 border-ink p-12 flex-col justify-between">
        <Logo />
        <div>
          <h1 className="font-display font-extrabold text-5xl leading-tight text-ink">
            Hello there. <br />
            <span className="scribble-pink">Find your people.</span>
          </h1>
          <p className="mt-5 text-ink2 max-w-md">
            Free forever plan. No credit card. Get 5 lead searches every month.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              "5 free searches /mo",
              "1 free CSV export",
              "Save & tag leads",
              "Pipeline stages",
            ].map((b) => (
              <div key={b} className="bg-white border-2 border-ink rounded-xl px-3 py-2 text-sm font-semibold">
                ✓ {b}
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs font-mono text-ink3">© LeadLoop 2026 · pastel & retro</div>
      </aside>

      <main className="flex-1 flex items-center justify-center p-8 bg-cream">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-8"><Logo /></div>
          <h2 className="font-display font-extrabold text-3xl text-ink">Create your account</h2>
          <p className="text-ink3 text-sm mt-1">Plan selected: <strong>{plan}</strong></p>
          <div className="retro-card p-6 mt-6">
            <SignupForm defaultPlan={plan} />
          </div>
          <div className="mt-6 text-sm text-center text-ink3">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-pink underline">Sign in</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
