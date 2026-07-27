import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Receives a device push token from the ORVIQO app.
 *
 * Tokens are logged for now rather than stored — sending pushes needs an
 * APNs/FCM key that isn't set up yet, and storing device identifiers we
 * can't use would be pointless. Wire this to a store the day pushes go live.
 */
export async function POST(req: NextRequest) {
  let body: { token?: unknown; platform?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const token = typeof body.token === "string" ? body.token.trim() : "";
  if (!token || token.length > 512) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const platform = typeof body.platform === "string" ? body.platform.slice(0, 32) : "unknown";
  // Only a fingerprint — never log a full device token.
  console.info(
    `push-token registered (${platform}) …${token.slice(-6)} len=${token.length}`
  );

  return NextResponse.json({ ok: true });
}
