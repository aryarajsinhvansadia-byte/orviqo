"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A real spoken conversation with ORVIQO's agent — the visitor's microphone in,
 * Claude out loud. The browser handles speech-to-text and text-to-speech; the
 * thinking is the same live agent that powers the concierge.
 *
 * The loop is hands-free: listen → think → speak → listen again, until the
 * visitor ends it. The mic is always closed while the agent is speaking so the
 * voice never hears itself.
 */

/* --- minimal Web Speech typings (not in the standard TS lib) --- */
type SpeechRecognitionAlternative = { transcript: string };
type SpeechRecognitionResult = {
  isFinal: boolean;
  0: SpeechRecognitionAlternative;
};
type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: { length: number; [i: number]: SpeechRecognitionResult };
};
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};
type RecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

type Phase = "idle" | "listening" | "thinking" | "speaking";
type Turn = { role: "user" | "assistant"; content: string };

const OPENER =
  "Hi — I'm ORVIQO's assistant. Tell me about your business and what you'd like to build, and I'll tell you honestly what I'd do first.";

export default function LiveVoiceAgent() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);
  const [typed, setTyped] = useState("");

  const recognition = useRef<SpeechRecognitionLike | null>(null);
  const active = useRef(false); // conversation running?
  const history = useRef<Turn[]>([]);
  const finalText = useRef("");
  const speechQueue = useRef<string[]>([]);
  const speaking = useRef(false);
  const streamDone = useRef(false);
  const voice = useRef<SpeechSynthesisVoice | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  // Late-bound so the speech loop can reopen the mic without a circular import
  // of callbacks (assigned once startListening exists, below).
  const listenAgain = useRef<() => void>(() => {});
  const phaseRef = useRef<Phase>("idle");
  phaseRef.current = phase;

  useEffect(() => {
    setSupported(getRecognitionCtor() !== null);
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo({
      top: logRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [turns, interim]);

  /* pick the least robotic English voice available */
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const choose = () => {
      const all = window.speechSynthesis.getVoices();
      if (!all.length) return;
      const preferred = [
        /Google UK English Female/i,
        /Samantha/i,
        /Google US English/i,
        /Karen|Serena|Moira/i,
        /en-IN/i,
      ];
      for (const re of preferred) {
        const hit = all.find((v) => re.test(v.name) || re.test(v.lang));
        if (hit) {
          voice.current = hit;
          return;
        }
      }
      voice.current = all.find((v) => v.lang.startsWith("en")) ?? all[0];
    };
    choose();
    window.speechSynthesis.addEventListener("voiceschanged", choose);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", choose);
  }, []);

  const stopEverything = useCallback(() => {
    active.current = false;
    speechQueue.current = [];
    speaking.current = false;
    try {
      recognition.current?.abort();
    } catch {}
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
  }, []);

  useEffect(() => () => stopEverything(), [stopEverything]);

  /* ---------- speaking ---------- */

  const drainSpeech = useCallback(() => {
    if (speaking.current) return;
    const next = speechQueue.current.shift();
    if (next === undefined) {
      // nothing queued: if the stream is finished, the turn is over
      if (streamDone.current && active.current) listenAgain.current();
      return;
    }
    speaking.current = true;
    setPhase("speaking");
    const utter = new SpeechSynthesisUtterance(next);
    if (voice.current) utter.voice = voice.current;
    utter.rate = 1.02;
    utter.pitch = 1;
    const done = () => {
      speaking.current = false;
      drainSpeech();
    };
    utter.onend = done;
    utter.onerror = done;
    window.speechSynthesis.speak(utter);
  }, []);

  const say = useCallback(
    (text: string) => {
      const t = text.trim();
      if (!t) return;
      speechQueue.current.push(t);
      drainSpeech();
    },
    [drainSpeech]
  );

  /* ---------- the agent turn ---------- */

  const ask = useCallback(
    async (text: string) => {
      setInterim("");
      setPhase("thinking");
      history.current = [...history.current, { role: "user", content: text }];
      setTurns([...history.current]);

      streamDone.current = false;
      let spokenUpTo = 0;
      let full = "";

      try {
        const res = await fetch("/api/voice/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history.current }),
        });
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          // Speak each sentence as soon as it lands — no waiting for the end.
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            full += decoder.decode(value, { stream: true });
            const boundary = full.lastIndexOf(". ");
            const cut = Math.max(
              boundary,
              full.lastIndexOf("? "),
              full.lastIndexOf("! "),
              full.lastIndexOf("\n")
            );
            if (cut > spokenUpTo) {
              say(full.slice(spokenUpTo, cut + 1));
              spokenUpTo = cut + 1;
            }
            setTurns([
              ...history.current,
              { role: "assistant", content: full },
            ]);
          }
        }
        if (full.slice(spokenUpTo).trim()) say(full.slice(spokenUpTo));

        history.current = [
          ...history.current,
          { role: "assistant", content: full },
        ];
        setTurns([...history.current]);
      } catch {
        say("Sorry — I lost the connection there. Could you say that again?");
      } finally {
        streamDone.current = true;
        drainSpeech(); // if speech already finished, this resumes listening
      }
    },
    [say, drainSpeech]
  );

  /* ---------- listening ---------- */

  const startListening = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor || !active.current) return;
    try {
      recognition.current?.abort();
    } catch {}

    const rec = new Ctor();
    rec.lang = "en-IN";
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    finalText.current = "";

    rec.onresult = (e) => {
      let live = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText.current += r[0].transcript;
        else live += r[0].transcript;
      }
      setInterim(live);
    };

    rec.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setError(
          "Microphone access is blocked. Allow it in your browser's address bar, then start again."
        );
        stopEverything();
        setPhase("idle");
      }
      // "no-speech" and "aborted" are normal — onend handles the restart.
    };

    rec.onend = () => {
      if (!active.current) return;
      const said = finalText.current.trim();
      if (said) ask(said);
      else if (phaseRef.current === "listening") listenAgain.current(); // silence: keep the line open
    };

    recognition.current = rec;
    try {
      rec.start();
      setPhase("listening");
    } catch {
      /* start() throws if already running — harmless */
    }
  }, [ask]);

  listenAgain.current = startListening;

  /* ---------- controls ---------- */

  function begin() {
    setError(null);
    setTurns([]);
    history.current = [];
    active.current = true;
    streamDone.current = true;
    speechQueue.current = [];
    setTurns([{ role: "assistant", content: OPENER }]);
    history.current = [{ role: "assistant", content: OPENER }];
    say(OPENER);
  }

  function end() {
    stopEverything();
    setPhase("idle");
    setInterim("");
  }

  function sendTyped(e: React.FormEvent) {
    e.preventDefault();
    const t = typed.trim();
    if (!t || phase === "thinking") return;
    setTyped("");
    active.current = false; // typed mode: reply out loud, don't reopen the mic
    streamDone.current = true;
    ask(t);
  }

  const live = phase !== "idle";
  const label =
    phase === "listening"
      ? "listening…"
      : phase === "thinking"
        ? "thinking…"
        : phase === "speaking"
          ? "speaking…"
          : "ready";

  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-hairline bg-[#07070c]">
      {/* header */}
      <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-slate">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-corona-soft" aria-hidden>
              <path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3Z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <div className="leading-tight">
            <p className="text-sm font-medium text-moon">Voice agent — live</p>
            <p className="mono-s text-ash">{label}</p>
          </div>
        </div>
        <Bars active={phase === "speaking"} listening={phase === "listening"} />
      </div>

      {/* transcript */}
      <div
        ref={logRef}
        className="h-72 space-y-3 overflow-y-auto px-4 py-4"
        aria-live="polite"
      >
        {turns.length === 0 && (
          <p className="pt-16 text-center text-sm text-ash">
            {supported
              ? "Press start, allow the microphone, and just talk — it answers out loud."
              : "This browser can't hear you, but you can type below and it will still answer out loud. Chrome, Edge and Safari support the microphone."}
          </p>
        )}
        {turns.map((t, i) => (
          <div key={i} className={`flex ${t.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[0.85rem] leading-relaxed ${
                t.role === "user"
                  ? "rounded-br-sm bg-moon text-night"
                  : "rounded-bl-sm border border-hairline bg-slate text-moon/90"
              }`}
            >
              <span className="mono-s mb-0.5 block text-[0.55rem] uppercase tracking-widest opacity-60">
                {t.role === "user" ? "You" : "ORVIQO"}
              </span>
              {t.content || "…"}
            </div>
          </div>
        ))}
        {interim && (
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-br-sm border border-hairline px-3.5 py-2 text-[0.85rem] italic text-ash">
              {interim}
            </div>
          </div>
        )}
      </div>

      {/* controls */}
      <div className="border-t border-hairline px-5 py-4">
        {supported ? (
          <button
            type="button"
            onClick={live ? end : begin}
            className={`w-full rounded-full py-3 font-medium transition-colors ${
              live
                ? "border border-hairline text-moon hover:border-moon/40"
                : "bg-moon text-night hover:bg-corona-soft"
            }`}
          >
            {live ? "End the conversation" : "▶ Start talking"}
          </button>
        ) : (
          <form onSubmit={sendTyped} className="flex gap-2">
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="Type instead…"
              aria-label="Ask the voice agent"
              className="min-w-0 flex-1 rounded-full border border-hairline bg-transparent px-4 py-2.5 text-sm text-moon placeholder:text-ash/60 focus:border-corona-soft/70 focus:outline-none"
            />
            <button
              type="submit"
              disabled={phase === "thinking"}
              className="rounded-full bg-moon px-5 py-2.5 text-sm font-medium text-night transition-colors hover:bg-corona-soft disabled:opacity-50"
            >
              Ask
            </button>
          </form>
        )}

        {error && (
          <p className="mono-s mt-3 text-center text-corona-soft" role="alert">
            {error}
          </p>
        )}
        <p className="mono-s mt-3 text-center text-ash">
          Live — your voice, a real model, spoken back. Production systems answer
          your actual phone line.
        </p>
      </div>
    </div>
  );
}

function Bars({ active, listening }: { active: boolean; listening: boolean }) {
  const on = active || listening;
  return (
    <span aria-hidden className="flex h-4 items-end gap-[3px]">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full ${active ? "bg-corona-soft" : listening ? "bg-moon/70" : "bg-ash/40"}`}
          style={
            on
              ? {
                  height: `${6 + ((i * 7) % 11)}px`,
                  animation: `voice-bounce ${active ? "0.8s" : "1.6s"} ease-in-out ${i * 0.11}s infinite alternate`,
                }
              : { height: 4 }
          }
        />
      ))}
      <style>{`@keyframes voice-bounce { from { transform: scaleY(0.35); } to { transform: scaleY(1.45); } } @media (prefers-reduced-motion: reduce) { span[aria-hidden] span { animation: none !important; } }`}</style>
    </span>
  );
}
