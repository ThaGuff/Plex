import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { leadsToCsv } from "@/lib/apify";

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const searchId = url.searchParams.get("searchId");
  const scope = url.searchParams.get("scope") ?? "search"; // search | saved

  let leads: Awaited<ReturnType<typeof prisma.lead.findMany>> = [];
  if (scope === "saved") {
    const saved = await prisma.savedLead.findMany({
      where: { userId: user.id },
      include: { lead: true },
      orderBy: { createdAt: "desc" },
    });
    leads = saved.map((s) => s.lead);
  } else if (searchId) {
    const search = await prisma.search.findFirst({
      where: { id: searchId, userId: user.id },
      include: { leads: true },
    });
    if (!search) return NextResponse.json({ error: "Search not found" }, { status: 404 });
    leads = search.leads;
  } else {
    return NextResponse.json({ error: "searchId or scope=saved required" }, { status: 400 });
  }

  const csv = leadsToCsv(
    leads.map((l) => ({
      externalId: l.externalId ?? "",
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
      tags: l.tags ? (JSON.parse(l.tags) as string[]) : [],
      score: l.score,
    }))
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leadloop-${scope}-${Date.now()}.csv"`,
    },
  });
}
