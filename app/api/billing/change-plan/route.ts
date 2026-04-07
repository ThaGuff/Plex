import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const planId = String(body.planId ?? "");
  if (!planId) return NextResponse.json({ error: "planId required" }, { status: 400 });
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });

  await prisma.user.update({ where: { id: user.id }, data: { planId } });

  await prisma.subscription.create({
    data: {
      userId: user.id,
      planId,
      status: "active",
      amountCents: plan.priceCents,
      renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  return NextResponse.json({ ok: true });
}
