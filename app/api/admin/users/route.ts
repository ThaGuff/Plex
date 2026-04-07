import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function ensureAdmin() {
  const u = await getSessionUser();
  if (!u || u.role !== "admin") return null;
  return u;
}

export async function PATCH(req: NextRequest) {
  const admin = await ensureAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const userId = String(body.userId ?? "");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const data: { status?: string; planId?: string } = {};
  if (body.status) data.status = String(body.status);
  if (body.planId) data.planId = String(body.planId);
  await prisma.user.update({ where: { id: userId }, data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const admin = await ensureAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  if (userId === admin.id) return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
  await prisma.user.delete({ where: { id: userId } });
  return NextResponse.json({ ok: true });
}
