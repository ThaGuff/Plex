import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SettingsForm } from "@/components/SettingsForm";
import { apifyMode } from "@/lib/apify";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await requireUser();
  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) return null;
  const mode = apifyMode();

  return (
    <div className="p-8 max-w-3xl">
      <span className="chip chip-sky">settings</span>
      <h1 className="font-display font-extrabold text-4xl md:text-5xl text-ink mt-3">
        Settings
      </h1>

      <div className="retro-card p-6 mt-8">
        <h2 className="font-display font-extrabold text-xl mb-4">Profile</h2>
        <SettingsForm
          name={user.name ?? ""}
          company={user.company ?? ""}
          email={user.email}
        />
      </div>

      <div className="retro-card p-6 mt-6 bg-sunSoft">
        <h2 className="font-display font-extrabold text-xl">Apify connection</h2>
        <div className="mt-3 flex items-center gap-2">
          <span className={`chip ${mode === "live" ? "chip-mint" : "chip-sun"}`}>
            ● {mode}
          </span>
          <span className="font-mono text-xs text-ink3">actor: code_crafter/leads-finder</span>
        </div>
        <p className="text-sm text-ink2 mt-3">
          {mode === "live"
            ? "Your platform is connected to the live Apify Leads Finder. New searches will pull real data."
            : "No APIFY_TOKEN configured. The platform runs in mock mode with realistic synthetic data — perfect for demos. Add your token to .env to go live."}
        </p>
        <a
          href="https://apify.com/code_crafter/leads-finder?fpr=p2hrc6"
          target="_blank" rel="noreferrer"
          className="btn btn-sm btn-ink mt-3"
        >
          Get an Apify token →
        </a>
      </div>

      <div className="retro-card p-6 mt-6">
        <h2 className="font-display font-extrabold text-xl">Danger zone</h2>
        <p className="text-sm text-ink3 mt-1">Sign out of all sessions on this device.</p>
        <a href="/api/auth/logout" className="btn btn-sm btn-ink mt-3">Sign out</a>
      </div>
    </div>
  );
}
