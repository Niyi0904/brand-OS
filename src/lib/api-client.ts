"use client";

import { useBrandStore } from "@/lib/stores/brand-store";

type FetchOptions = RequestInit & {
  skipBrandHeader?: boolean;
};

/**
 * Brand-aware fetch wrapper.
 *
 * Automatically injects the `X-Brand-Id` header into every request
 * so API routes can enforce tenant isolation server-side.
 *
 * Call `skipBrandHeader: true` for auth or brand-switching requests
 * that should not carry the header.
 */
export async function apiFetch(url: string, options: FetchOptions = {}) {
  const { skipBrandHeader, ...fetchOpts } = options;

  const headers = new Headers(fetchOpts.headers);

  if (!skipBrandHeader) {
    const brandId = useBrandStore.getState().currentBrand?.id;
    if (brandId) {
      headers.set("X-Brand-Id", brandId);
    }
  }

  if (!headers.has("Content-Type") && fetchOpts.body) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, { ...fetchOpts, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error || res.statusText);
  }

  return res;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
