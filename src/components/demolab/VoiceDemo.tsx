"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Voice AI — a simulated call, honestly labelled. The transcript plays out in
 * real time with a live waveform while the AI "speaks". Production systems
 * connect to real telephony; this shows the conversation design.
 */
const SCRIPT: { from: "caller" | "ai"; text: string }[] = [
  { from: "ai", text: "Good afternoon — you've reached Meridian Interiors. How can I help?" },
  { from: "caller", text: "Hi, I wanted to ask about renovating a 3BHK. Do you handle full projects?" },
  { from: "ai", text: "We do — full design and execution, from concept to handover. May I ask which city the home is in?" },
  { from: "caller", text: "Vadodara. Alkapuri." },
  { from: "ai", text: "Lovely. The next step is a short consultation with our design lead. I have Thursday 4pm or Saturday 11am open — would either suit you?" },
  { from: "caller", text: "Saturday works." },
  { from: "ai", text: "Booked — Saturday, 11am. I'll send a confirmation on WhatsApp with our studio address. Anything else I can help with?" },
  { from: "caller", text: "No, that's all. Thanks!" },
  { from: "ai", text: "A pleasure. We'll see you Saturday." },
];

function Waveform({ active }: { active: boolean }) {
  return (
    <span aria-hidden className="flex h-4 items-end gap-[3px]">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full bg-corona-soft transition-all ${active ? "" : "!h-1 opacity-40"}`}
          style={
            active
              ? { height: `${6 + ((i * 7) % 11)}px`, animation: `wave-bounce 0.9s ease-in-out ${i * 0.12}s infinite alternate` }
              : { height: 4 }
          }
        />
      ))}
      <style>{`@keyframes wave-bounce { from { transform: scaleY(0.4); } to { transform: scaleY(1.4); } } @media (prefers-reduced-motion: reduce) { span[aria-hidden] span { animation: none !important; } }`}</style>
    </span>
  );
}

export default function VoiceDemo() {
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [step]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function advance(next: number) {
    if (next >= SCRIPT.length) {
      setPlaying(false);
      return;
    }
    setStep(next);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dwell = reduced ? 60 : Math.max(1400, SCRIPT[next].text.length * 42);
    timer.current = setTimeout(() => advance(next + 1), dwell);
  }

  function play() {
    if (timer.current) clearTimeout(timer.current);
    setPlaying(true);
    setStep(-1);
    timer.current = setTimeout(() => advance(0), 400);
  }

  const finished = !playing && step === SCRIPT.length - 1;

  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-hairline bg-[#07070c]">
      {/* call header */}
      <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-slate">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-corona-soft" aria-hidden>
              <path d="M6 3h4l2 5-2.5 1.5a12 12 0 0 0 5 5L16 12l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="leading-tight">
            <p className="text-sm font-medium text-moon">Voice AI — receptionist</p>
            <p className="mono-s text-ash">{playing ? "on call…" : finished ? "call ended" : "ready"}</p>
          </div>
        </div>
        <Waveform active={playing && step >= 0 && SCRIPT[step].from === "ai"} />
      </div>

      {/* transcript */}
      <div ref={logRef} className="h-72 space-y-3 overflow-y-auto px-4 py-4">
        {step < 0 && !playing && (
          <p className="pt-16 text-center text-sm text-ash">
            Press play to hear how a Voice AI handles a real enquiry.
          </p>
        )}
        {SCRIPT.slice(0, step + 1).map((line, i) => (
          <div key={i} className={`flex ${line.from === "caller" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[0.85rem] leading-relaxed ${
                line.from === "caller"
                  ? "rounded-br-sm bg-moon text-night"
                  : "rounded-bl-sm border border-hairline bg-slate text-moon/90"
              }`}
            >
              <span className="mono-s mb-0.5 block text-[0.55rem] uppercase tracking-widest opacity-60">
                {line.from === "caller" ? "Caller" : "AI"}
              </span>
              {line.text}
            </div>
          </div>
        ))}
      </div>

      {/* controls + honesty label */}
      <div className="border-t border-hairline px-5 py-4">
        <button
          type="button"
          onClick={play}
          className="w-full rounded-full bg-moon py-3 font-medium text-night transition-colors hover:bg-corona-soft"
        >
          {playing ? "Restart the call" : finished ? "Replay the call" : "▶ Play the call"}
        </button>
        <p className="mono-s mt-3 text-center text-ash">
          Simulated conversation — production Voice AI connects to your real phone lines.
        </p>
      </div>
    </div>
  );
}
