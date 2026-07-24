import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

type ClientMessage = { role: "user" | "assistant"; content: string };

const MODEL = "claude-opus-4-8";
const MAX_MESSAGES = 24;
const MAX_CHARS = 6000;

/** Graceful plain-text fallback when the AI can't run (e.g. key not set yet). */
function fallback(text: string) {
  return new Response(text, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return fallback(
      "I'm just being switched on — the live assistant isn't connected yet. In the meantime, tell the studio what you're building at hello@orviqo.net or through the contact page, and you'll hear back within a working day."
    );
  }

  let messages: ClientMessage[];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  // Sanitise: keep the last N turns, cap length, enforce shape.
  const cleaned = messages
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  if (cleaned.length === 0 || cleaned[cleaned.length - 1].role !== "user") {
    return new Response("Bad request", { status: 400 });
  }

  const client = new Anthropic();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = client.messages.stream({
          model: MODEL,
          max_tokens: 1024,
          output_config: { effort: "low" },
          system: [
            {
              type: "text",
              text: buildSystemPrompt(),
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: cleaned,
        });

        for await (const event of anthropicStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        console.error("chat route error", err);
        const already = (controller.desiredSize ?? 0) < 0;
        if (!already) {
          controller.enqueue(
            encoder.encode(
              "\n\nSorry — something went wrong on my side. Please try again, or reach the studio directly at hello@orviqo.net."
            )
          );
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
