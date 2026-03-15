import { NextResponse } from "next/server";
import { getVapidPublicKey } from "@/lib/push";

export async function GET() {
  const key = getVapidPublicKey();
  if (!key) {
    return NextResponse.json({ enabled: false }, { status: 200 });
  }
  return NextResponse.json({ enabled: true, publicKey: key });
}
