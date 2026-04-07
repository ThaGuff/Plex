import { requireUser } from "@/lib/auth";
import { SearchClient } from "@/components/SearchClient";

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  await requireUser();
  return (
    <div className="p-8 max-w-7xl">
      <span className="chip chip-pink">find leads</span>
      <h1 className="font-display font-extrabold text-4xl md:text-5xl text-ink mt-3">
        Search the universe.
      </h1>
      <p className="text-ink3 mt-2 max-w-2xl">
        Combine filters to narrow your ICP. We&apos;ll hit the Apify Leads Finder API and bring back matches in seconds.
      </p>
      <div className="mt-8">
        <SearchClient />
      </div>
    </div>
  );
}
