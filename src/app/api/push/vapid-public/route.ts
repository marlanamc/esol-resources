import { NextResponse } from "next/server";
import { CACHE_CDN_HOUR, jsonWithCacheControl } from "@/lib/api/cache-control";
import { getVapidPublicKey } from "@/lib/push";

export async function GET() {
  const key = getVapidPublicKey();
  if (!key) {
    return jsonWithCacheControl({ enabled: false }, CACHE_CDN_HOUR);
  }
  return jsonWithCacheControl({ enabled: true, publicKey: key }, CACHE_CDN_HOUR);
}
