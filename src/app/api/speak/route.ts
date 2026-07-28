export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * The studio's own voice.
 *
 * Browsers can only speak the languages the device happens to ship. On macOS
 * that means Gujarati is simply unavailable — Apple's catalogue has no Gujarati
 * voice installed or downloadable — so a browser-only assistant is mute in the
 * language half of Vadodara actually speaks.
 *
 * This route removes that dependency: Google's speech service holds voices for
 * all four of our languages, so the site sounds the same on every device.
 *
 * Without GOOGLE_TTS_API_KEY set it returns 503 and the client quietly falls
 * back to whatever the browser can manage. Nothing breaks; it just gets quieter.
 */

const ENDPOINT = "https://texttospeech.googleapis.com/v1/text:synthesize";

/** Only these may be requested — no arbitrary locale passthrough. */
const LANGS: Record<string, string> = {
  "en-IN": "en-IN",
  "hi-IN": "hi-IN",
  "gu-IN": "gu-IN",
  "mr-IN": "mr-IN",
};

const MAX_CHARS = 800;

export async function POST(req: Request) {
  const key = process.env.GOOGLE_TTS_API_KEY;
  if (!key) {
    return Response.json({ error: "voice-not-configured" }, { status: 503 });
  }

  let body: { text?: unknown; lang?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim().slice(0, MAX_CHARS) : "";
  const languageCode = typeof body.lang === "string" ? LANGS[body.lang] : undefined;

  if (!text || !languageCode) {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  try {
    const res = await fetch(`${ENDPOINT}?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text },
        // No voice name: Google picks the best default for the locale, which
        // survives their catalogue changing under us.
        voice: { languageCode, ssmlGender: "FEMALE" },
        audioConfig: { audioEncoding: "MP3", speakingRate: 1.0 },
      }),
    });

    if (!res.ok) {
      return Response.json({ error: "synthesis-failed" }, { status: 502 });
    }

    const data = (await res.json()) as { audioContent?: string };
    if (!data.audioContent) {
      return Response.json({ error: "synthesis-failed" }, { status: 502 });
    }

    return new Response(Buffer.from(data.audioContent, "base64"), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return Response.json({ error: "synthesis-failed" }, { status: 502 });
  }
}
