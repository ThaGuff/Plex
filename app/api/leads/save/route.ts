import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const leadId = String(body.leadId ?? "");
  if (!leadId) return NextResponse.json({ error: "leadId required" }, { status: 400 });

  try {
    await prisma.savedLead.upsert({
      where: { userId_leadId: { userId: user.id, leadId } },
      update: {},
      create: { userId: user.id, leadId },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Could not save lead" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const leadId = url.searchParams.get("leadId");
  if (!leadId) return NextResponse.json({ error: "leadId required" }, { status: 400 });
  await prisma.savedLead.deleteMany({ where: { userId: user.id, leadId } });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const id = String(body.id ?? "");
  const status = body.status ? String(body.status) : undefined;
  const notes = body.notes != null ? String(body.notes) : undefined;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.savedLead.update({
    where: { id },
    data: { status, notes },
  });
  return NextResponse.json({ ok: true });
}
