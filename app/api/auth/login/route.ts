import { NextRequest, NextResponse } from "next/server";
import { createSession, loginWithCredentials } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }
  const result = await loginWithCredentials(email, password);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 401 });
  if (result.user.role === "admin") {
    return NextResponse.json({ error: "Use the admin login portal" }, { status: 403 });
  }
  await createSession(result.user);
  return NextResponse.json({ ok: true, redirect: "/dashboard" });
}
