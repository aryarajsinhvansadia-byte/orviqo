import Anthropic from "@anthropic-ai/sdk";
import { DEMO_TOOLS, runDemoTool, classifyBrief, matchCaseStudy, estimateTimeline } from "@/lib/agent-tools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MODEL = "claude-opus-4-8";

const SYSTEM = `You are ORVIQO's intake agent, demonstrated live on the studio's website. A visitor gives you a project brief; you plan it using your tools, then report.

Rules:
- Always call classify_brief first, then match_case_study, then estimate_timeline. One at a time.
- Then write the final report, exactly this shape, under 110 words total:
  a one-line read of what they need; then three short lines starting with "→ " (the approach, the relevant proof with the case-study name, the timeline band); then one closing line inviting them to hello@orviqo.com.
- Warm, precise, zero hype. No emoji. Never invent facts, clients, or prices — pricing is "scoped after one call".
- If the brief is not a project brief (spam, gibberish, off-topic), skip the tools and reply in one gracious line inviting a real brief.`;

type Ev =
  | { type: "status"; text: string }
  | { type: "tool_call"; name: string; input: unknown }
  | { type: "tool_result"; name: string; output: unknown }
  | { type: "text"; chunk: string }
  | { type: "done"; live: boolean };

function ndjson(controller: ReadableStreamDefaultController, enc: TextEncoder, ev: Ev) {
  controller.enqueue(enc.encode(JSON.stringify(ev) + "\n"));
}

/** No API key: replay a session computed by the real tools — honest, zero cost. */
function replayStream(brief: string) {
  const enc = new TextEncoder();
  const cls = classifyBrief(brief);
  const match = matchCaseStudy(cls.sector, cls.needs);
  const est = estimateTimeline(cls.needs);
  const events: Ev[] = [
    { type: "status", text: "Agent online — reading the brief…" },
    { type: "tool_call", name: "classify_brief", input: { brief } },
    { type: "tool_result", name: "classify_brief", output: cls },
    { type: "tool_call", name: "match_case_study", input: { sector: cls.sector, needs: cls.needs } },
    { type: "tool_result", name: "match_case_study", output: match },
    { type: "tool_call", name: "estimate_timeline", input: { needs: cls.needs } },
    { type: "tool_result", name: "estimate_timeline", output: est },
    { type: "text", chunk: `Read: a ${cls.sector} project centred on ${cls.needs.join(" + ")}.\n` },
    { type: "text", chunk: `→ Approach: design and engineering as one team, scoped around ${cls.needs[0]}.\n` },
    { type: "text", chunk: `→ Proof: see ${match.caseStudy} — ${match.whyRelevant}\n` },
    { type: "text", chunk: `→ Timeline: ${est.band}, across our five phases.\n` },
    { type: "text", chunk: `Next: write to hello@orviqo.com and you'll have an honest read within a working day.` },
    { type: "done", live: false },
  ];
  return new ReadableStream({
    async start(controller) {
      for (const ev of events) {
        ndjson(controller, enc, ev);
        await new Promise((r) => setTimeout(r, ev.type === "tool_result" ? 700 : 420));
      }
      controller.close();
    },
  });
}

export async function POST(req: Request) {
  let brief = "";
  try {
    const body = await req.json();
    brief = String(body?.brief ?? "").slice(0, 600).trim();
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  if (!brief) return new Response("Bad request", { status: 400 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(replayStream(brief), {
      headers: { "Content-Type": "application/x-ndjson", "Cache-Control": "no-store" },
    });
  }

  const client = new Anthropic();
  const enc = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        ndjson(controller, enc, { type: "status", text: "Agent online — reading the brief…" });

        type Msg = Anthropic.MessageParam;
        const messages: Msg[] = [{ role: "user", content: `Project brief from a website visitor:\n"""${brief}"""` }];

        for (let round = 0; round < 5; round++) {
          const res = await client.messages.create({
            model: MODEL,
            max_tokens: 600,
            output_config: { effort: "low" },
            system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
            tools: DEMO_TOOLS,
            messages,
          });

          const toolUses = res.content.filter((b) => b.type === "tool_use");

          if (res.stop_reason !== "tool_use" || toolUses.length === 0) {
            // final report — emit text line by line for the console feel
            const text = res.content
              .filter((b) => b.type === "text")
              .map((b) => b.text)
              .join("");
            for (const line of text.split("\n")) {
              if (line.trim()) ndjson(controller, enc, { type: "text", chunk: line + "\n" });
              await new Promise((r) => setTimeout(r, 120));
            }
            break;
          }

          messages.push({ role: "assistant", content: res.content });
          const results: Anthropic.ToolResultBlockParam[] = [];
          for (const tu of toolUses) {
            ndjson(controller, enc, { type: "tool_call", name: tu.name, input: tu.input });
            const output = runDemoTool(tu.name, tu.input as Record<string, unknown>);
            ndjson(controller, enc, { type: "tool_result", name: tu.name, output });
            results.push({ type: "tool_result", tool_use_id: tu.id, content: JSON.stringify(output) });
          }
          messages.push({ role: "user", content: results });
        }

        ndjson(controller, enc, { type: "done", live: true });
        controller.close();
      } catch (err) {
        console.error("agent-demo error", err);
        ndjson(controller, enc, {
          type: "text",
          chunk: "The live agent hit turbulence — try again, or write to hello@orviqo.com.",
        });
        ndjson(controller, enc, { type: "done", live: true });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson", "Cache-Control": "no-store" },
  });
}
