import { NextRequest, NextResponse } from "next/server";

/**
 * Validates that the request Origin matches the expected host.
 * Used as a lightweight CSRF guard on mutating API routes.
 */
export function validateCsrf(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) return false;

  try {
    const originUrl = new URL(origin);
    return originUrl.host === host;
  } catch {
    return false;
  }
}

/**
 * Returns a 403 CSRF rejection response.
 */
export function csrfError() {
  return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
}