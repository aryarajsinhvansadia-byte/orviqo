"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEFAULT_LANG,
  VOICE_LANGS,
  pickVoice,
  withDirective,
  type LangCode,
  type VoiceLang,
} from "@/lib/voice-langs";
import { createSpeaker, getRecognitionCtor, type Recognition } from "@/lib/speech";
import { getSessionId, resetSessionId } from "@/lib/session";

/**
 * ORVIQO's booking assistant — type or talk, in four languages.
 *
 * The thinking happens in the n8n workflow (which owns the calendar, the
 * lead table and the email alert); this is just a brand-native front end
 * with speech in and speech out layered on top.
 */
const WEBHOOK_URL =
  "https://orviqo.app.n8n.cloud/webhook/0e614cff-6c48-46e3-a8bf-6906d718c326/chat";

type Turn = { role: "user" | "assistant"; text: string };

export default function BookingChat() {
  const [lang, setLang] = useState<VoiceLang>(DEFAULT_LANG);
  const [turns, setTurns] = useState<Turn[]>([
    { role: "assistant", text: DEFAULT_LANG.greeting },
  ]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const [speakReplies, setSpeakReplies] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  /** Does the device itself have a voice for this script? */
  const [hasBrowserVoice, setHasBrowserVoice] = useState(true);
  /** Latched once we learn the studio voice isn't configured. */
  const [serverVoiceOff, setServerVoiceOff] = useState(false);
  // Silent only when neither source can speak this language.
  const canSpeak = hasBrowserVoice || !serverVoiceOff;

  const recognition = useRef<Recognition | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const voice = useRef<SpeechSynthesisVoice | null>(null);
  const speaker = useRef(createSpeaker());

  useEffect(() => setMicSupported(getRecognitionCtor() !== null), []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, thinking]);

  /* Re-pick the voice whenever the language changes or voices finish loading. */
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
    return () => window.speechSynthesis.removeEventListener("voiceschanged", choose);
  }, [lang]);

  const speak = useCallback(
    async (text: string) => {
      if (typeof window === "undefined") return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      speaker.current.cancel();
      await speaker.current.play(text, lang, voice.current);
      // After the first attempt we know whether the studio voice exists.
      if (speaker.current.serverOk() === false) setServerVoiceOff(true);
    },
    [lang]
  );

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
            sessionId: getSessionId(),
            chatInput: withDirective(message, lang),
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
    [thinking, speakReplies, speak, lang]
  );

  const startListening = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;
    try {
      recognition.current?.abort();
    } catch {}
    const rec = new Ctor();
    rec.lang = lang.stt;
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
  }, [send, lang]);

  /** Switching language resets the thread so the greeting matches. */
  function switchLang(code: LangCode) {
    const next = VOICE_LANGS.find((l) => l.code === code) ?? DEFAULT_LANG;
    if (next.code === lang.code) return;
    try {
      recognition.current?.abort();
    } catch {}
    speaker.current.cancel();
    setListening(false);
    setNotice(null);
    setLang(next);
    setDraft("");
    setTurns([{ role: "assistant", text: next.greeting }]);
    // A fresh session so the agent doesn't carry the old language over.
    resetSessionId();
  }

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

  useEffect(() => {
    const sp = speaker.current;
    return () => {
      try {
        recognition.current?.abort();
      } catch {}
      sp.cancel();
    };
  }, []);

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
            if (!next) speaker.current.cancel();
          }}
          aria-pressed={speakReplies}
          disabled={!canSpeak}
          title={canSpeak ? undefined : "This device has no voice for this language"}
          className={`mono-s rounded-full border px-3 py-1 transition-colors disabled:opacity-40 ${
            speakReplies && canSpeak
              ? "border-corona-soft/60 text-moon light-rim"
              : "border-hairline text-ash hover:border-moon/30 hover:text-moon"
          }`}
        >
          {speakReplies && canSpeak ? "Voice on" : "Voice off"}
        </button>
      </div>

      {/* language */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-hairline px-5 py-2.5">
        <span className="mono-s mr-1 shrink-0 text-ash">Language</span>
        {VOICE_LANGS.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => switchLang(l.code)}
            aria-pressed={l.code === lang.code}
            className={`shrink-0 rounded-full border px-3 py-1 text-[0.8rem] transition-colors ${
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
            placeholder={listening ? "Listening…" : lang.placeholder}
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
          {!canSpeak &&
            " No voice is available for this language on this device, so replies stay on screen."}
        </p>
      </div>
    </div>
  );
}
