import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const data: { name?: string; company?: string } = {};
  if (typeof body.name === "string") data.name = body.name;
  if (typeof body.company === "string") data.company = body.company;
  await prisma.user.update({ where: { id: user.id }, data });
  return NextResponse.json({ ok: true });
}
