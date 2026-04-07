import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "dev-secret-change-me-in-production-please-32ch"
);
const COOKIE = "leadloop_session";

const PUBLIC_PATHS = [
  "/",
  "/pricing",
  "/login",
  "/signup",
  "/admin/login",
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/admin-login",
  "/api/auth/logout",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip Next internals & static
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/logo") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  const token = req.cookies.get(COOKIE)?.value;
  let role: string | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET);
      role = (payload.role as string) ?? "user";
    } catch {
      role = null;
    }
  }

  // Admin section
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!role) return NextResponse.redirect(new URL("/admin/login", req.url));
    if (role !== "admin")
      return NextResponse.redirect(new URL("/admin/login?error=forbidden", req.url));
    return NextResponse.next();
  }

  // User app section
  const APP_PATHS = ["/app", "/dashboard", "/search", "/leads", "/history", "/billing", "/settings"];
  if (APP_PATHS.some((p) => pathname.startsWith(p))) {
    if (!role) return NextResponse.redirect(new URL("/login", req.url));
    return NextResponse.next();
  }

  if (isPublic) return NextResponse.next();

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
