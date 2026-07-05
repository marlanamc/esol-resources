export const runtime = "edge";

import { CACHE_CDN_SHORT, jsonWithCacheControl } from "@/lib/api/cache-control";

export function GET() {
  return jsonWithCacheControl({ ok: true }, CACHE_CDN_SHORT);
}
