"use client";

import { useEffect, useRef, useState } from "react";
import ScrambleText from "@/components/ScrambleText";

/**
 * The Agent Theatre — a live demonstration of agentic AI, on the open web.
 * The visitor gives a brief; a real agent (Claude, server-side) plans it:
 * every tool call and result is disclosed in an agent console as it happens.
 * Planning visibility + tool-use disclosure — the 2026 agentic-UX patterns —
 * as a lived experience rather than a diagram.
 */

type Ev =
  | { type: "status"; text: string }
  | { type: "tool_call"; name: string; input: unknown }
  | { type: "tool_result"; name: string; output: unknown }
  | { type: "text"; chunk: string }
  | { type: "done"; live: boolean };

const SAMPLE_BRIEF =
  "A dental clinic in Pune — we want online appointment booking, fewer no-shows, and to finally rank on Google.";

export default function AgentTheatre() {
  const [events, setEvents] = useState<Ev[]>([]);
  const [brief, setBrief] = useState("");
  const [running, setRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const autoplayed = useRef(false);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [events]);

  async function run(text: string) {
    if (running) return;
    const q = text.trim();
    if (!q) return;
    setRunning(true);
    setHasRun(true);
    setEvents([]);
    try {
      const res = await fetch("/api/agent-demo/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief: q }),
      });
      if (!res.ok || !res.body) throw new Error("no stream");
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const ev = JSON.parse(line) as Ev;
            setEvents((e) => [...e, ev]);
          } catch {
            /* partial line */
          }
        }
      }
    } catch {
      setEvents((e) => [
        ...e,
        { type: "text", chunk: "Couldn't reach the agent — try again, or write to hello@orviqo.com." },
        { type: "done", live: false },
      ]);
    } finally {
      setRunning(false);
    }
  }

  // Autoplay the sample brief the first time the theatre is seen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !autoplayed.current) {
          autoplayed.current = true;
          run(SAMPLE_BRIEF);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDone = events.some((e) => e.type === "done");
  const wasLive = events.some((e) => e.type === "done" && e.live);

  return (
    <section ref={sectionRef} className="shell section" aria-label="Live agent demonstration">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        {/* the pitch */}
        <div>
          <ScrambleText as="p" text="Agentic AI — demonstrated live" className="eyebrow" />
          <h2 className="display display-xl mt-8">
            Watch an agent <em className="serif-i not-italic">think.</em>
          </h2>
          <p className="mt-8 max-w-md text-lg text-ash">
            This console is not a mockup. Type a brief and a real AI agent — the
            same pattern we ship inside client products — will classify it, call
            its tools, and plan your project in front of you.
          </p>
          <p className="mono-s mt-6 text-ash">
            Every tool call disclosed. Nothing pre-scripted{wasLive ? "" : " — live once you run it"}.
          </p>
        </div>

        {/* the console */}
        <div className="overflow-hidden rounded-xl border border-hairline bg-[#07070c] shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between border-b border-hairline px-4 py-2.5">
            <span className="mono-s text-ash">orviqo — intake agent</span>
            <span className="mono-s flex items-center gap-1.5 text-corona-soft/90">
              <span className={`h-1.5 w-1.5 rounded-full ${running ? "animate-pulse bg-corona" : "bg-[#5AA469]"}`} />
              {running ? "working" : isDone ? (wasLive ? "live session ended" : "session ended") : "idle"}
            </span>
          </div>

          <div ref={logRef} className="h-80 space-y-2.5 overflow-y-auto px-4 py-4 font-mono text-[0.78rem] leading-relaxed">
            {events.length === 0 && !running && (
              <p className="text-ash">— the agent will run when you scroll here, or press Run —</p>
            )}
            {events.map((ev, i) => {
              if (ev.type === "status")
                return (
                  <p key={i} className="text-ash">
                    <span className="text-corona-soft">●</span> {ev.text}
                  </p>
                );
              if (ev.type === "tool_call")
                return (
                  <p key={i} className="text-moon/85">
                    <span className="mr-2 rounded border border-corona-soft/40 px-1.5 py-0.5 text-[0.65rem] uppercase tracking-wider text-corona-soft">
                      tool
                    </span>
                    {ev.name}
                    <span className="text-ash">({JSON.stringify(ev.input).slice(0, 90)}…)</span>
                  </p>
                );
              if (ev.type === "tool_result")
                return (
                  <p key={i} className="pl-6 text-ash">
                    ↳ {JSON.stringify(ev.output).slice(0, 160)}
                  </p>
                );
              if (ev.type === "text")
                return (
                  <p key={i} className="whitespace-pre-wrap text-moon">
                    {ev.chunk}
                  </p>
                );
              return (
                <p key={i} className="text-ash">
                  — session complete {ev.live ? "(live model run)" : "(replayed from the same tools)"} —
                </p>
              );
            })}
            {running && <p className="animate-pulse text-corona-soft">▋</p>}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(brief || SAMPLE_BRIEF);
            }}
            className="flex items-center gap-2 border-t border-hairline px-3 py-3"
          >
            <input
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder={hasRun ? "Try your own brief…" : SAMPLE_BRIEF}
              aria-label="Your project brief for the live agent"
              className="min-w-0 flex-1 rounded-full border border-hairline bg-slate px-4 py-2.5 font-mono text-[0.78rem] text-moon outline-none placeholder:text-ash/50 focus:border-corona-soft/50"
              maxLength={600}
            />
            <button
              type="submit"
              disabled={running}
              data-cursor="Run"
              className="shrink-0 rounded-full bg-moon px-5 py-2.5 text-sm font-medium text-night transition-colors hover:bg-corona-soft disabled:opacity-40"
            >
              {running ? "Running…" : "Run"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
