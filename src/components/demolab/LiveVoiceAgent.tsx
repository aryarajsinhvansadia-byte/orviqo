"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEFAULT_LANG,
  VOICE_LANGS,
  pickVoice,
  toSpeechChunks,
  withDirective,
  type LangCode,
  type VoiceLang,
} from "@/lib/voice-langs";
import { createSpeaker, getRecognitionCtor, type Recognition } from "@/lib/speech";
import { getSessionId, resetSessionId } from "@/lib/session";

/**
 * A real spoken conversation with ORVIQO's agent — the visitor's microphone in,
 * the studio's booking brain out loud, in four languages.
 *
 * The loop is hands-free: listen → think → speak → listen again, until the
 * visitor ends it. The mic is always closed while the agent is speaking so the
 * voice never hears itself.
 *
 * This talks to the same n8n workflow as /talk/ rather than to /api/voice/,
 * because that workflow is the only thing holding the calendar tool. Routing
 * here is what lets someone book a consultation with their voice — the plain
 * API route can answer questions beautifully but has no hands.
 *
 * The trade: n8n replies in one piece instead of streaming, so the agent waits
 * for the whole answer before it starts talking. Sentence-splitting on arrival
 * keeps the delivery natural once it does.
 */
const BOOKING_URL =
  "https://orviqo.app.n8n.cloud/webhook/0e614cff-6c48-46e3-a8bf-6906d718c326/chat";

type Phase = "idle" | "listening" | "thinking" | "speaking";
type Turn = { role: "user" | "assistant"; content: string };

export default function LiveVoiceAgent() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);
  const [typed, setTyped] = useState("");
  const [lang, setLang] = useState<VoiceLang>(DEFAULT_LANG);
  const [hasBrowserVoice, setHasBrowserVoice] = useState(true);
  const [serverVoiceOff, setServerVoiceOff] = useState(false);
  // Silent only when neither the studio voice nor the device can speak this.
  const canSpeak = hasBrowserVoice || !serverVoiceOff;

  // Mirrored so the speech loop reads the current language without being
  // rebuilt (and torn down mid-conversation) every time it changes.
  const langRef = useRef<VoiceLang>(DEFAULT_LANG);
  langRef.current = lang;

  const recognition = useRef<Recognition | null>(null);
  const active = useRef(false); // conversation running?
  const history = useRef<Turn[]>([]);
  const finalText = useRef("");
  const speechQueue = useRef<string[]>([]);
  const speaking = useRef(false);
  const streamDone = useRef(false);
  const voice = useRef<SpeechSynthesisVoice | null>(null);
  const speaker = useRef(createSpeaker());
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

  /* Re-pick the voice when the language changes or voices finish loading. */
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const choose = () => {
      const all = window.speechSynthesis.getVoices();
      if (!all.length) return; // still loading — voiceschanged will fire
      const hit = pickVoice(lang, all);
      voice.current = hit;
      setHasBrowserVoice(hit !== null);
    };
    choose();
    window.speechSynthesis.addEventListener("voiceschanged", choose);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", choose);
  }, [lang]);

  const stopEverything = useCallback(() => {
    active.current = false;
    speechQueue.current = [];
    speaking.current = false;
    try {
      recognition.current?.abort();
    } catch {}
    speaker.current.cancel();
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
    // play() always settles — even when nothing can speak this script — so the
    // listen → think → speak loop can never stall waiting on a voice.
    speaker.current
      .play(next, langRef.current, voice.current)
      .catch(() => {})
      .finally(() => {
        if (speaker.current.serverOk() === false) setServerVoiceOff(true);
        speaking.current = false;
        drainSpeech();
      });
  }, []);

  const say = useCallback(
    (text: string) => {
      const t = text.trim();
      if (!t) return;
      // Queue regardless of the device's own voices — the studio voice may be
      // able to read a script the browser can't, and the speaker resolves
      // silently if neither can.
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

      try {
        // The booking workflow — the only brain wired to the studio calendar.
        const res = await fetch(BOOKING_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "sendMessage",
            sessionId: getSessionId(),
            chatInput: withDirective(text, langRef.current),
          }),
        });
        const data = (await res.json().catch(() => null)) as { output?: string } | null;
        const reply = data?.output?.trim();
        if (!reply) throw new Error("no reply");

        history.current = [...history.current, { role: "assistant", content: reply }];
        setTurns([...history.current]);
        // Sentence by sentence, so the delivery breathes instead of arriving
        // as one long unbroken utterance.
        for (const chunk of toSpeechChunks(reply)) say(chunk);
      } catch {
        const sorry = "Sorry — I lost the connection there. Could you say that again?";
        history.current = [...history.current, { role: "assistant", content: sorry }];
        setTurns([...history.current]);
        say(sorry);
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
    rec.lang = langRef.current.stt;
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
    const opener = lang.greeting;
    setTurns([{ role: "assistant", content: opener }]);
    history.current = [{ role: "assistant", content: opener }];
    say(opener);
  }

  function end() {
    stopEverything();
    setPhase("idle");
    setInterim("");
  }

  /** Switching language ends the current call and starts a clean session. */
  function switchLang(code: LangCode) {
    const next = VOICE_LANGS.find((l) => l.code === code) ?? DEFAULT_LANG;
    if (next.code === lang.code) return;
    stopEverything();
    setPhase("idle");
    setInterim("");
    setTurns([]);
    setError(null);
    history.current = [];
    setLang(next);
    langRef.current = next;
    resetSessionId();
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

      {/* language */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-hairline px-4 py-2.5">
        {VOICE_LANGS.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => switchLang(l.code)}
            aria-pressed={l.code === lang.code}
            className={`shrink-0 rounded-full border px-3 py-1 text-[0.78rem] transition-colors ${
              l.code === lang.code
                ? "border-corona-soft/60 bg-corona-soft/10 text-moon"
                : "border-hairline text-ash hover:border-moon/30 hover:text-moon"
            }`}
          >
            {l.label}
          </button>
        ))}
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
          {canSpeak
            ? "Live — your voice, a real model, spoken back. It can book a consultation while you talk."
            : "Live — it hears you and can book a consultation, but your device has no voice for this language, so it replies on screen."}
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
