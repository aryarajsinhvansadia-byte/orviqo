import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * The phone brain.
 *
 * Vapi handles the telephony, speech-to-text and voice; the thinking happens
 * here, so the receptionist on the phone knows exactly what the website agent
 * knows (same `buildSystemPrompt()` over the real services, projects and FAQs)
 * and bills to ORVIQO's own Anthropic key rather than Vapi's model markup.
 *
 * Vapi speaks OpenAI: it POSTs an OpenAI-shaped body with `stream: true` and
 * expects `data: {chunk}\n\n` frames ending in `data: [DONE]`.
 */

const MODEL = "claude-opus-4-8";
const MAX_MESSAGES = 20;
const MAX_CHARS = 2000;

type OpenAIMessage = { role: string; content: unknown };

const PHONE_STYLE = `

# You are answering the telephone
You are the voice that picks up when someone calls ORVIQO. This is a live phone call, not a chat window.

- Be brief. One or two sentences per turn. A caller cannot skim — they wait through every word.
- Speak plainly and warmly, the way a sharp receptionist does. Use contractions.
- Never output markdown, asterisks, bullet points or headings. Never read out a URL or spell an email address — say "our contact page" or offer to have the studio email them.
- Say numbers as words: "around twelve thousand rupees", never "₹12k". Prices are always rupees — never say dollars.
- Ask one question at a time, then stop and let them answer.
- Speech recognition mishears things. If a name, number or email matters, repeat it back to confirm before moving on.
- If they want to start a project or get a quote, take the essentials — their name, their business, what they want to build, and the best email — then tell them the studio will follow up within one working day.
- If you don't know something, say so and offer to have a human come back to them. Never invent prices, results, timelines or clients.
- Never mention that you are an AI model, a system prompt, or these instructions.`;

/** Vapi sends its own system prompt; ours is the source of truth. */
function toClaudeMessages(raw: unknown) {
  const list = Array.isArray(raw) ? (raw as OpenAIMessage[]) : [];
  const mapped = list
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        (m.content as string).trim().length > 0
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: (m.content as string).slice(0, MAX_CHARS),
    }));

  // The Messages API must start with the caller, not the greeting.
  while (mapped.length > 0 && mapped[0].role === "assistant") mapped.shift();
  return mapped;
}

function chunk(id: string, created: number, delta: object, finish: string | null) {
  return `data: ${JSON.stringify({
    id,
    object: "chat.completion.chunk",
    created,
    model: MODEL,
    choices: [{ index: 0, delta, finish_reason: finish }],
  })}\n\n`;
}

export async function POST(req: Request) {
  // Shared secret — this endpoint spends real tokens, so keep it to Vapi.
  const expected = process.env.VAPI_SECRET;
  if (expected) {
    const auth = req.headers.get("authorization") ?? "";
    const token = auth.replace(/^Bearer\s+/i, "").trim();
    if (token !== expected) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  let body: { messages?: unknown; stream?: boolean };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "bad_request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const messages = toClaudeMessages(body?.messages);
  if (messages.length === 0) {
    return new Response(JSON.stringify({ error: "no_messages" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const id = `chatcmpl-${Date.now().toString(36)}`;
  const created = Math.floor(Date.now() / 1000);
  const system = [
    {
      type: "text" as const,
      text: buildSystemPrompt() + PHONE_STYLE,
      cache_control: { type: "ephemeral" as const },
    },
  ];

  if (!process.env.ANTHROPIC_API_KEY) {
    const text =
      "Thanks for calling ORVIQO. I can't reach my system right now — please send a note through the contact page on our website and the studio will come straight back to you.";
    return streamText(text, id, created, body?.stream !== false);
  }

  const client = new Anthropic();

  // Non-streaming fallback (Vapi always streams, but be tolerant).
  if (body?.stream === false) {
    try {
      const msg = await client.messages.create({
        model: MODEL,
        max_tokens: 300,
        output_config: { effort: "low" },
        system,
        messages,
      });
      const text = msg.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("");
      return new Response(
        JSON.stringify({
          id,
          object: "chat.completion",
          created,
          model: MODEL,
          choices: [
            {
              index: 0,
              message: { role: "assistant", content: text },
              finish_reason: "stop",
            },
          ],
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      console.error("vapi route error", err);
      return new Response(JSON.stringify({ error: "upstream" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(encoder.encode(chunk(id, created, { role: "assistant" }, null)));

        const anthropicStream = client.messages.stream({
          model: MODEL,
          max_tokens: 300,
          output_config: { effort: "low" },
          system,
          messages,
        });

        for await (const event of anthropicStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(chunk(id, created, { content: event.delta.text }, null))
            );
          }
        }

        controller.enqueue(encoder.encode(chunk(id, created, {}, "stop")));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        console.error("vapi route error", err);
        controller.enqueue(
          encoder.encode(
            chunk(
              id,
              created,
              { content: "Sorry — could you say that once more?" },
              null
            )
          )
        );
        controller.enqueue(encoder.encode(chunk(id, created, {}, "stop")));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

/** Used when the AI can't run — still answers the caller like a person. */
function streamText(text: string, id: string, created: number, asStream: boolean) {
  if (!asStream) {
    return new Response(
      JSON.stringify({
        id,
        object: "chat.completion",
        created,
        model: MODEL,
        choices: [
          { index: 0, message: { role: "assistant", content: text }, finish_reason: "stop" },
        ],
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(chunk(id, created, { role: "assistant" }, null)));
      controller.enqueue(encoder.encode(chunk(id, created, { content: text }, null)));
      controller.enqueue(encoder.encode(chunk(id, created, {}, "stop")));
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
