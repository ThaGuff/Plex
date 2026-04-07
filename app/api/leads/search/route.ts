import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { searchLeads, type LeadFilters } from "@/lib/apify";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Plan limits
  const plan = await prisma.plan.findUnique({ where: { id: user.planId } });
  if (plan) {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const used = await prisma.search.count({
      where: { userId: user.id, createdAt: { gte: monthStart } },
    });
    if (plan.searchesPerMo > 0 && used >= plan.searchesPerMo) {
      return NextResponse.json(
        { error: `Monthly search limit reached (${plan.searchesPerMo}). Upgrade to keep searching.` },
        { status: 402 }
      );
    }
  }

  const body = await req.json().catch(() => ({}));
  const filters: LeadFilters = {
    keyword: str(body.keyword),
    industry: str(body.industry),
    location: str(body.location),
    city: str(body.city),
    country: str(body.country),
    jobTitle: str(body.jobTitle),
    minEmployees: num(body.minEmployees),
    maxEmployees: num(body.maxEmployees),
    hasEmail: bool(body.hasEmail),
    hasPhone: bool(body.hasPhone),
    limit: Math.min(Math.max(num(body.limit) ?? 25, 5), 100),
  };

  const summary = [filters.industry, filters.location, filters.jobTitle, filters.keyword]
    .filter(Boolean)
    .join(" · ") || "All leads";

  const result = await searchLeads(filters);

  const search = await prisma.search.create({
    data: {
      userId: user.id,
      query: summary,
      filters: JSON.stringify(filters),
      results: result.count,
      source: result.source,
      leads: {
        create: result.leads.map((l) => ({
          externalId: l.externalId,
          name: l.name,
          title: l.title,
          company: l.company,
          industry: l.industry,
          location: l.location,
          email: l.email,
          phone: l.phone,
          website: l.website,
          linkedinUrl: l.linkedinUrl,
          twitterUrl: l.twitterUrl,
          facebookUrl: l.facebookUrl,
          employees: l.employees,
          revenue: l.revenue,
          description: l.description,
          tags: JSON.stringify(l.tags),
          score: l.score,
          payload: JSON.stringify(l.raw ?? {}),
        })),
      },
    },
    include: { leads: true },
  });

  return NextResponse.json({
    ok: true,
    source: result.source,
    searchId: search.id,
    count: search.leads.length,
    leads: search.leads,
  });
}

function str(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t === "" ? undefined : t;
}
function num(v: unknown): number | undefined {
  if (v === "" || v == null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}
function bool(v: unknown): boolean | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v === "true" || v === "on" || v === "1";
  return undefined;
}
