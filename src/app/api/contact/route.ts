import { NextRequest, NextResponse } from "next/server";
import { request as httpsRequest } from "node:https";

export const runtime = "nodejs";
export const maxDuration = 15;

/**
 * Raw HTTPS POST. Vercel's fetch (undici) strips browser-managed headers
 * like Origin/Referer, which FormSubmit requires — node:https sends every
 * header exactly as written.
 */
function postJson(
  url: string,
  headers: Record<string, string>,
  payload: string
): Promise<{ status: number; text: string }> {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const r = httpsRequest(
      {
        hostname: u.hostname,
        path: u.pathname,
        method: "POST",
        headers: { ...headers, "Content-Length": Buffer.byteLength(payload) },
      },
      (res) => {
        let text = "";
        res.on("data", (c) => (text += c));
        res.on("end", () => resolve({ status: res.statusCode ?? 0, text }));
      }
    );
    r.on("error", reject);
    r.setTimeout(10000, () => r.destroy(new Error("timeout")));
    r.write(payload);
    r.end();
  });
}

/**
 * Lead capture. Validates the enquiry server-side and forwards it to the
 * studio inbox via FormSubmit's AJAX API (no client-exposed address, no
 * stored data). If forwarding fails the client falls back to a prefilled
 * mailto — the form never dead-ends.
 */
// FormSubmit alias for the studio inbox (activated for this domain);
// override with CONTACT_TO_EMAIL if the destination ever changes.
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "4869341b38731a7c6ce12cb7d5d553e3";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // Honeypot: bots fill it, humans never see it. Pretend success.
  if (clean(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 200);
  const company = clean(body.company, 200);
  const email = clean(body.email, 320);
  const budget = clean(body.budget, 100);
  const message = clean(body.message, 5000);

  if (!name || !message || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  try {
    // FormSubmit validates Origin/Referer; forward the real public origin.
    // (req.nextUrl.origin is the internal localhost on Vercel, so use the
    // forwarded headers instead.)
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || "https";
    const origin = host ? `${proto}://${host}` : "https://orviqo.com";
    const res = await postJson(
      `https://formsubmit.co/ajax/${TO_EMAIL}`,
      {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: origin,
        Referer: `${origin}/contact/`,
        "User-Agent":
          "Mozilla/5.0 (compatible; ORVIQO-contact/1.0; +https://orviqo.com)",
      },
      JSON.stringify({
        _subject: `ORVIQO enquiry — ${company || name}`,
        _template: "table",
        _captcha: "false",
        _replyto: email,
        Name: name,
        Company: company || "—",
        Email: email,
        Budget: budget || "Not specified",
        Message: message,
        Page: clean(body.page, 300) || "/contact/",
      })
    );

    let data: { success?: string | boolean } | null = null;
    try {
      data = JSON.parse(res.text);
    } catch {}
    const delivered =
      res.status >= 200 &&
      res.status < 300 &&
      data !== null &&
      String(data.success).toLowerCase() !== "false";

    if (!delivered) {
      console.error("contact: forward failed", res.status, res.text.slice(0, 300));
      return NextResponse.json({ ok: false, error: "forward_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact: forward error", err);
    return NextResponse.json({ ok: false, error: "forward_failed" }, { status: 502 });
  }
}
