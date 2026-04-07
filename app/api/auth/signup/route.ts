import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1).optional().nullable(),
  company: z.string().optional().nullable(),
  planId: z.enum(["free", "starter", "pro", "scale"]).optional(),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const { email, password, name, company, planId } = parsed.data;
  const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (exists) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash: await hashPassword(password),
      name: name ?? null,
      company: company ?? null,
      role: "user",
      planId: planId ?? "free",
      status: "active",
    },
  });

  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: "user",
    planId: user.planId,
  });

  return NextResponse.json({ ok: true, redirect: "/dashboard" });
}
