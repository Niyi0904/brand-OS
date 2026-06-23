import { NextResponse } from "next/server";
import { auth } from "@/lib/auth-edge";

export default auth(async (req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isOnAuth = req.nextUrl.pathname.startsWith("/auth");
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");

  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/signin", req.nextUrl));
  }

  if (isOnAuth && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // Forward the active brand cookie as a request header for API routes
  if (isApiRoute) {
    const requestHeaders = new Headers(req.headers);
    const activeBrandId = req.cookies.get("active_brand_id")?.value;
    if (activeBrandId) {
      requestHeaders.set("x-active-brand-id", activeBrandId);
    }
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // For dashboard pages, also forward for server component use
  if (isOnDashboard) {
    const requestHeaders = new Headers(req.headers);
    const activeBrandId = req.cookies.get("active_brand_id")?.value;
    if (activeBrandId) {
      requestHeaders.set("x-active-brand-id", activeBrandId);
    }
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  return null;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
