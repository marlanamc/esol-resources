/**
 * Shared Cache-Control values for API routes.
 *
 * Use `CDN_*` presets on GET responses that are identical for every caller so
 * Vercel's edge cache can serve repeat traffic without invoking a function.
 * Auth-gated or per-user payloads should use `NO_STORE` or `PRIVATE_SHORT`.
 */

import { NextResponse } from "next/server";

export const CACHE_NO_STORE = "no-store";

/** Browser-only revalidation for per-user JSON (no shared CDN cache). */
export const CACHE_PRIVATE_SHORT =
  "private, max-age=30, stale-while-revalidate=60";

/** Shared CDN cache for read-heavy, non-personalized GET responses. */
export const CACHE_CDN_SHORT =
  "public, s-maxage=60, stale-while-revalidate=300";

export const CACHE_CDN_HOUR =
  "public, s-maxage=3600, stale-while-revalidate=86400";

export function jsonWithCacheControl<T>(
  data: T,
  cacheControl: string,
  init?: ResponseInit
): NextResponse<T> {
  return NextResponse.json(data, {
    ...init,
    headers: {
      ...Object.fromEntries(new Headers(init?.headers).entries()),
      "Cache-Control": cacheControl,
    },
  });
}
