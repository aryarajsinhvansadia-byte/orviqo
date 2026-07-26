"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * ORVIQO's booking assistant — type or talk.
 *
 * The thinking happens in the n8n workflow (which owns the calendar, the
 * lead table and the email alert); this is just a brand-native front end
 * with speech in and speech out layered on top.
 */
const WEBHOOK_URL =
  "https://orviqo.app.n8n.cloud/webhook/0e614cff-6c48-46e3-a8bf-6906d718c326/chat";

/* --- minimal Web Speech typings (not in the standard TS lib) --- */
type SRAlternative = { transcript: string };
type SRResult = { isFinal: boolean; 0: SRAlternative };
type SREvent = { resultIndex: number; results: { length: number; [i: number]: SRResult } };
type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: SREvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};
type RecognitionCtor = new () => Recognition;

function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

type Turn = { role: "user" | "assistant"; text: string };

const OPENER =
  "Hello — I'm ORVIQO's assistant. Tell me about your business and what you'd like to build, and I can book you a free consultation right here.";

export default function BookingChat() {
  const [turns, setTurns] = useState<Turn[]>([{ role: "assistant", text: OPENER }]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const [speakReplies, setSpeakReplies] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const sessionId = useRef(
    `orviqo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  );
  const recognition = useRef<Recognition | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const voice = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => setMicSupported(getRecognitionCtor() !== null), []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, thinking]);

  /* pick a decent English voice once they're loaded */
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const choose = () => {
      const all = window.speechSynthesis.getVoices();
      if (!all.length) return;
      const wanted = [/Google UK English Female/i, /Samantha/i, /Google US English/i, /en-IN/i];
      for (const re of wanted) {
        const hit = all.find((v) => re.test(v.name) || re.test(v.lang));
        if (hit) return (voice.current = hit);
      }
      voice.current = all.find((v) => v.lang.startsWith("en")) ?? all[0];
    };
    choose();
    window.speechSynthesis.addEventListener("voiceschanged", choose);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", choose);
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voice.current) u.voice = voice.current;
    u.rate = 1.02;
    window.speechSynthesis.speak(u);
  }, []);

  const send = useCallback(
    async (text: string) => {
      const message = text.trim();
      if (!message || thinking) return;
      setNotice(null);
      setDraft("");
      setTurns((t) => [...t, { role: "user", text: message }]);
      setThinking(true);
      try {
        const res = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "sendMessage",
            sessionId: sessionId.current,
            chatInput: message,
          }),
        });
        const data = (await res.json().catch(() => null)) as { output?: string } | null;
        const reply =
          data?.output?.trim() ||
          "Sorry — I didn't catch that. Could you try again, or email hello@orviqo.net?";
        setTurns((t) => [...t, { role: "assistant", text: reply }]);
        if (speakReplies) speak(reply);
      } catch {
        setTurns((t) => [
          ...t,
          {
            role: "assistant",
            text: "I couldn't reach the studio just now. Please try again, or write to hello@orviqo.net.",
          },
        ]);
      } finally {
        setThinking(false);
      }
    },
    [thinking, speakReplies, speak]
  );

  const startListening = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;
    try {
      recognition.current?.abort();
    } catch {}
    const rec = new Ctor();
    rec.lang = "en-IN";
    rec.continuous = false;
    rec.interimResults = true;
    let finalText = "";

    rec.onresult = (e) => {
      let live = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else live += r[0].transcript;
      }
      setDraft(finalText + live);
    };
    rec.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setNotice("Microphone access is blocked. Allow it in your browser, or just type instead.");
      }
      setListening(false);
    };
    rec.onend = () => {
      setListening(false);
      const said = finalText.trim();
      if (said) send(said);
    };

    recognition.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {}
  }, [send]);

  function toggleMic() {
    if (listening) {
      try {
        recognition.current?.stop();
      } catch {}
      setListening(false);
    } else {
      startListening();
    }
  }

  useEffect(
    () => () => {
      try {
        recognition.current?.abort();
      } catch {}
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    },
    []
  );

  return (
    <div className="mx-auto flex h-[62vh] min-h-[460px] max-w-2xl flex-col overflow-hidden rounded-[4px] border border-hairline bg-night/60 backdrop-blur-sm">
      {/* header */}
      <div className="flex items-center justify-between border-b border-hairline px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="h-2 w-2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, var(--color-corona-soft), var(--color-corona))",
              boxShadow: "0 0 10px rgba(255,139,61,0.7)",
            }}
          />
          <p className="mono-s text-moon">
            ORVIQO assistant
            <span className="ml-3 text-ash">
              {listening ? "listening…" : thinking ? "thinking…" : "ready"}
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            const next = !speakReplies;
            setSpeakReplies(next);
            if (!next && typeof window !== "undefined") window.speechSynthesis?.cancel();
          }}
          aria-pressed={speakReplies}
          className={`mono-s rounded-full border px-3 py-1 transition-colors ${
            speakReplies
              ? "border-corona-soft/60 text-moon light-rim"
              : "border-hairline text-ash hover:border-moon/30 hover:text-moon"
          }`}
        >
          {speakReplies ? "Voice on" : "Voice off"}
        </button>
      </div>

      {/* transcript */}
      <div ref={logRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5" aria-live="polite">
        {turns.map((t, i) => (
          <div key={i} className={`flex ${t.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-[4px] px-4 py-2.5 text-[0.92rem] leading-relaxed ${
                t.role === "user"
                  ? "bg-moon text-night"
                  : "border border-hairline bg-slate text-moon/90"
              }`}
            >
              {t.text}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="rounded-[4px] border border-hairline bg-slate px-4 py-2.5">
              <span className="flex gap-1.5" aria-label="Thinking">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-corona-soft/70"
                    style={{ animation: `dot-pulse 1.1s ease-in-out ${i * 0.18}s infinite` }}
                  />
                ))}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* composer */}
      <div className="border-t border-hairline px-4 py-3.5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
          className="flex items-center gap-2"
        >
          {micSupported && (
            <button
              type="button"
              onClick={toggleMic}
              aria-label={listening ? "Stop listening" : "Speak your message"}
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors ${
                listening
                  ? "border-corona-soft/70 text-corona-soft light-rim"
                  : "border-hairline text-ash hover:border-moon/40 hover:text-moon"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
                <path
                  d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M5 11a7 7 0 0 0 14 0M12 18v3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={listening ? "Listening…" : "Tell me about your business…"}
            aria-label="Message"
            className="min-w-0 flex-1 rounded-full border border-hairline bg-transparent px-4 py-2.5 text-sm text-moon placeholder:text-ash/60 focus:border-corona-soft/70 focus:outline-none"
          />
          <button
            type="submit"
            disabled={thinking || !draft.trim()}
            className="shrink-0 rounded-full bg-moon px-5 py-2.5 text-sm font-medium text-night transition-colors hover:bg-corona-soft disabled:opacity-40"
          >
            Send
          </button>
        </form>
        {notice && (
          <p className="mono-s mt-2.5 text-corona-soft" role="alert">
            {notice}
          </p>
        )}
        <p className="mono-s mt-2.5 text-ash">
          {micSupported
            ? "Type, or tap the microphone to speak. It books straight into the studio calendar."
            : "It books straight into the studio calendar."}
        </p>
      </div>
    </div>
  );
}
