import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-1/2 bg-pinkSoft border-r-3 border-ink p-12 flex-col justify-between">
        <Logo />
        <div>
          <h1 className="font-display font-extrabold text-5xl leading-tight text-ink">
            Welcome back. <br />
            <span className="scribble">Let&apos;s find leads.</span>
          </h1>
          <p className="mt-5 text-ink2 max-w-md">
            Sign in to your LeadLoop dashboard. New here?{" "}
            <Link href="/signup" className="font-bold underline">Create a free account</Link>.
          </p>
        </div>
        <div className="text-xs font-mono text-ink3">© LeadLoop 2026 · pastel & retro</div>
      </aside>

      <main className="flex-1 flex items-center justify-center p-8 bg-cream">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-8"><Logo /></div>
          <h2 className="font-display font-extrabold text-3xl text-ink">Sign in</h2>
          <p className="text-ink3 text-sm mt-1">Use your email and password.</p>
          <div className="retro-card p-6 mt-6">
            <LoginForm endpoint="/api/auth/login" />
          </div>
          <div className="mt-4 text-xs text-ink3 font-mono text-center">
            Demo: <strong>demo@leadloop.dev</strong> / <strong>demo1234</strong>
          </div>
          <div className="mt-6 text-sm text-center text-ink3">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-bold text-pink underline">Sign up free</Link>
          </div>
          <div className="mt-2 text-sm text-center text-ink3">
            Admin? <Link href="/admin/login" className="font-semibold underline">Admin portal →</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
