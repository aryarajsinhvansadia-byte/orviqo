"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AGENT_GREETING, AGENT_SUGGESTIONS } from "@/lib/agent";
import { startScroll, stopScroll } from "@/components/SmoothScroll";
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

type Msg = { role: "user" | "assistant"; content: string };

const EASE = [0.22, 1, 0.36, 1] as const;

/** The assistant that can actually book — the same brain that powers /talk. */
const BOOKING_URL =
  "https://orviqo.app.n8n.cloud/webhook/0e614cff-6c48-46e3-a8bf-6906d718c326/chat";

export default function AgentChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: AGENT_GREETING },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [lang, setLang] = useState<VoiceLang>(DEFAULT_LANG);
  const [listening, setListening] = useState(false);
  const [speakReplies, setSpeakReplies] = useState(false);
  /** Hands-free mode: listen → answer → speak → listen, until ended. */
  const [voiceMode, setVoiceMode] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const voiceActive = useRef(false);
  // Late-bound so the turn can reopen the mic without the callbacks forming a cycle.
  const listenAgain = useRef<() => void>(() => {});
  const [micSupported, setMicSupported] = useState(false);
  const [hasBrowserVoice, setHasBrowserVoice] = useState(true);
  const [serverVoiceOff, setServerVoiceOff] = useState(false);
  // Silent only when neither the studio voice nor the device can speak this.
  const canSpeak = hasBrowserVoice || !serverVoiceOff;
  const reduce = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const recognition = useRef<Recognition | null>(null);
  const voice = useRef<SpeechSynthesisVoice | null>(null);
  const speaker = useRef(createSpeaker());

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => setMicSupported(getRecognitionCtor() !== null), []);

  /* Re-pick the device voice when the language changes or voices load. */
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

  /* Closing the widget must stop the mic, the voice and the hands-free loop. */
  useEffect(() => {
    if (open) return;
    voiceActive.current = false;
    setVoiceMode(false);
    try {
      recognition.current?.abort();
    } catch {}
    speaker.current.cancel();
    setListening(false);
  }, [open]);

  useEffect(() => {
    const sp = speaker.current;
    return () => {
      try {
        recognition.current?.abort();
      } catch {}
      sp.cancel();
    };
  }, []);

  const speak = useCallback(
    async (text: string) => {
      if (typeof window === "undefined") return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      speaker.current.cancel();
      for (const chunk of toSpeechChunks(text)) {
        await speaker.current.play(chunk, lang, voice.current);
      }
      if (speaker.current.serverOk() === false) setServerVoiceOff(true);
    },
    [lang]
  );

  useEffect(() => {
    if (open) {
      stopScroll();
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onKey);
      const t = setTimeout(() => inputRef.current?.focus(), 350);
      return () => {
        window.removeEventListener("keydown", onKey);
        clearTimeout(t);
      };
    }
    startScroll();
  }, [open]);

  /** Speak the answer if asked to, then hand the turn back to the visitor. */
  async function finishTurn(reply: string) {
    if (speakReplies || voiceActive.current) {
      setSpeaking(true);
      await speak(reply);
      setSpeaking(false);
    }
    if (voiceActive.current) listenAgain.current();
  }

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: q }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const setReply = (content: string) =>
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content };
        return copy;
      });

    try {
      // The booking brain: same assistant as /talk, so it can actually put a
      // consultation in the calendar rather than sending people elsewhere.
      const booking = await fetch(BOOKING_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sendMessage",
          sessionId: getSessionId(),
          chatInput: withDirective(q, lang),
        }),
        signal: controller.signal,
      });
      const data = (await booking.json().catch(() => null)) as { output?: string } | null;
      const reply = data?.output?.trim();
      if (!reply) throw new Error("no reply");
      setReply(reply);
      setBusy(false);
      await finishTurn(reply);
      return;
    } catch (bookingErr) {
      if ((bookingErr as Error).name === "AbortError") {
        setBusy(false);
        return;
      }
      // Fall back to the site's own assistant so the widget never dies.
      try {
        const res = await fetch("/api/chat/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: next }),
          signal: controller.signal,
        });
        if (!res.ok || !res.body) throw new Error("no stream");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let full = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          full += chunk;
          setMessages((m) => {
            const copy = [...m];
            copy[copy.length - 1] = {
              role: "assistant",
              content: copy[copy.length - 1].content + chunk,
            };
            return copy;
          });
        }
        setBusy(false);
        if (full.trim()) await finishTurn(full);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          const sorry =
            "Sorry — I couldn't reach the studio's assistant just now. Please try again, or email hello@orviqo.net.";
          setReply(sorry);
          setBusy(false);
          await finishTurn(sorry);
        }
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  function startListening() {
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
      setInput(finalText + live);
    };
    rec.onerror = (e) => {
      setListening(false);
      // A blocked mic would otherwise leave hands-free mode waiting forever.
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        voiceActive.current = false;
        setVoiceNotice(
          "I can't reach your microphone. Allow it in your browser's address bar, or keep typing."
        );
      }
    };
    rec.onend = () => {
      setListening(false);
      const said = finalText.trim();
      if (said) send(said);
      // Silence in hands-free mode isn't the end of the conversation — the
      // visitor is thinking. Reopen the mic instead of dropping the line.
      else if (voiceActive.current) listenAgain.current();
    };

    recognition.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {}
  }

  listenAgain.current = startListening;

  /** Opens the panel straight into a hands-free conversation. */
  function startVoiceMode() {
    setOpen(true);
    setVoiceMode(true);
    setSpeakReplies(true);
    setVoiceNotice(null);
    voiceActive.current = true;
    setInput("");
    startListening();
  }

  /** Back to typing, without closing the conversation. */
  function stopVoiceMode() {
    voiceActive.current = false;
    setVoiceMode(false);
    try {
      recognition.current?.abort();
    } catch {}
    speaker.current.cancel();
    setListening(false);
    setInput("");
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

  /** Switching language restarts the thread so the greeting matches. */
  function switchLang(code: LangCode) {
    const next = VOICE_LANGS.find((l) => l.code === code) ?? DEFAULT_LANG;
    if (next.code === lang.code) return;
    try {
      recognition.current?.abort();
    } catch {}
    speaker.current.cancel();
    setListening(false);
    setLang(next);
    setInput("");
    setMessages([
      // English keeps the widget's own opening line; the others greet natively.
      { role: "assistant", content: next.code === "en-IN" ? AGENT_GREETING : next.greeting },
    ]);
    resetSessionId();
  }

  // The canned prompts are English, so they only belong on the English thread.
  const showSuggestions = messages.length === 1 && lang.code === "en-IN" && !voiceMode;

  return (
    <>
      {/* launcher */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.7, ease: EASE }}
        className="fixed bottom-6 right-6 z-[85] flex items-center gap-2 md:bottom-8 md:right-8"
      >
        {/* straight into a spoken conversation — no menu, no page change */}
        {micSupported && !open && (
          <button
            type="button"
            onClick={startVoiceMode}
            aria-label="Talk to the ORVIQO assistant"
            data-cursor="Talk"
            className="group relative grid h-14 w-14 place-items-center rounded-full border border-hairline bg-slate/90 text-moon backdrop-blur-md transition-colors duration-300 hover:border-corona-soft/50"
          >
            <span
              aria-hidden
              className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ boxShadow: "0 0 22px rgba(255,139,61,0.35) inset" }}
            />
            <svg viewBox="0 0 24 24" fill="none" className="relative h-5 w-5" aria-hidden>
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

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close the ORVIQO assistant" : "Open the ORVIQO assistant"}
          aria-expanded={open}
          data-cursor={open ? "Close" : "Ask"}
          className="group flex h-14 items-center gap-3 rounded-full border border-hairline bg-slate/90 pl-4 pr-5 text-moon backdrop-blur-md transition-colors duration-300 hover:border-corona-soft/40"
        >
        <span className="relative flex h-2.5 w-2.5">
          {!reduce && (
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
              style={{ background: "var(--color-corona)" }}
            />
          )}
          <span
            className="relative inline-flex h-2.5 w-2.5 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, var(--color-corona-soft), var(--color-corona))",
              boxShadow: "0 0 10px rgba(255,139,61,0.7)",
            }}
          />
        </span>
          <span className="display text-[0.95rem] tracking-tight">
            {open ? "Close" : "Ask ORVIQO"}
          </span>
        </button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="ORVIQO assistant"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed bottom-24 right-4 z-[90] flex h-[min(600px,76vh)] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-hairline bg-night shadow-[0_30px_80px_rgba(0,0,0,0.6)] md:bottom-28 md:right-8"
          >
            {/* header */}
            <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden
                  className="h-8 w-8 shrink-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at 38% 35%, #17171f 0%, #0b0b11 60%), radial-gradient(circle, transparent 60%, rgba(255,139,61,0.6) 66%, transparent 72%)",
                    boxShadow: "0 0 16px rgba(255,139,61,0.35)",
                  }}
                />
                <div className="leading-tight">
                  <p className="display text-[1.05rem] text-moon">ORVIQO assistant</p>
                  <p className="mono-s flex items-center gap-1.5 text-ash">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5AA469]" />
                    {listening ? "listening…" : "powered by Claude"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = !speakReplies;
                  setSpeakReplies(next);
                  if (!next) speaker.current.cancel();
                }}
                aria-pressed={speakReplies}
                aria-label={speakReplies ? "Turn spoken replies off" : "Turn spoken replies on"}
                disabled={!canSpeak}
                className={`mono-s shrink-0 rounded-full border px-2.5 py-1 text-[0.7rem] transition-colors disabled:opacity-40 ${
                  speakReplies && canSpeak
                    ? "border-corona-soft/60 text-moon"
                    : "border-hairline text-ash hover:border-moon/30 hover:text-moon"
                }`}
              >
                {speakReplies && canSpeak ? "Voice on" : "Voice off"}
              </button>
            </div>

            {/* language */}
            <div className="flex items-center gap-1.5 overflow-x-auto border-b border-hairline px-4 py-2">
              {VOICE_LANGS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => switchLang(l.code)}
                  aria-pressed={l.code === lang.code}
                  className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[0.75rem] transition-colors ${
                    l.code === lang.code
                      ? "border-corona-soft/60 bg-corona-soft/10 text-moon"
                      : "border-hairline text-ash hover:border-moon/30 hover:text-moon"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* voice stage — replaces the thread while hands-free */}
            {voiceMode && (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-8">
                <div className="relative grid h-32 w-32 place-items-center">
                  {/* the corona breathes with whoever is talking */}
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, transparent 55%, rgba(255,139,61,0.28) 68%, transparent 76%)",
                      animation:
                        reduce || (!listening && !busy && !speaking)
                          ? undefined
                          : `${listening ? "voice-listen 1.6s" : busy ? "voice-think 1s" : "voice-speak 0.7s"} ease-in-out infinite`,
                    }}
                  />
                  <span
                    aria-hidden
                    className="h-20 w-20 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle at 38% 35%, #17171f 0%, #0b0b11 62%), radial-gradient(circle, transparent 58%, rgba(255,139,61,0.75) 66%, transparent 74%)",
                      boxShadow: "0 0 40px rgba(255,139,61,0.28)",
                    }}
                  />
                </div>

                <p className="mono-s text-ash">
                  {voiceNotice
                    ? "Microphone blocked"
                    : listening
                      ? "Listening…"
                      : busy
                        ? "Thinking…"
                        : speaking
                          ? "Speaking…"
                          : "Ready"}
                </p>

                <p className="min-h-[3.5rem] max-w-[18rem] text-center text-sm leading-relaxed text-moon/90">
                  {voiceNotice ||
                    input ||
                    messages[messages.length - 1]?.content.slice(0, 160) ||
                    "Say hello, or tell me about your business."}
                </p>

                <button
                  type="button"
                  onClick={stopVoiceMode}
                  className="rounded-full border border-hairline px-5 py-2 text-sm text-ash transition-colors hover:border-moon/40 hover:text-moon"
                >
                  Switch to typing
                </button>
              </div>
            )}

            {/* thread */}
            <div
              ref={scrollRef}
              hidden={voiceMode}
              className="flex-1 space-y-3.5 overflow-y-auto px-4 py-4"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[0.9rem] leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-br-sm bg-moon text-night"
                        : "rounded-bl-sm border border-hairline bg-slate text-moon/90"
                    }`}
                  >
                    {msg.content ||
                      (busy && i === messages.length - 1 ? (
                        <span className="inline-flex gap-1 py-1" aria-label="thinking">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ash [animation-delay:-0.2s]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ash [animation-delay:-0.1s]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ash" />
                        </span>
                      ) : null)}
                  </div>
                </div>
              ))}
            </div>

            {/* suggestions */}
            {showSuggestions && (
              <div className="flex flex-wrap gap-1.5 border-t border-hairline px-4 pt-3">
                {AGENT_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    data-cursor="Ask"
                    className="rounded-full border border-hairline px-3 py-1.5 text-xs text-ash transition-colors hover:border-corona-soft/40 hover:text-moon"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              hidden={voiceMode}
              className="flex items-center gap-2 px-4 py-3"
            >
              {micSupported && (
                <button
                  type="button"
                  onClick={toggleMic}
                  aria-label={listening ? "Stop listening" : "Speak your message"}
                  data-cursor={listening ? "Stop" : "Speak"}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    listening
                      ? "border-corona-soft/70 text-corona-soft"
                      : "border-hairline text-ash hover:border-moon/40 hover:text-moon"
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5" aria-hidden>
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
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  listening
                    ? "Listening…"
                    : lang.code === "en-IN"
                      ? "Ask anything…"
                      : lang.placeholder
                }
                aria-label="Message the ORVIQO assistant"
                className="min-w-0 flex-1 rounded-full border border-hairline bg-slate px-4 py-2.5 text-sm text-moon outline-none placeholder:text-ash/60 focus:border-corona-soft/50"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send message"
                data-cursor="Send"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-moon text-night transition-colors hover:bg-corona-soft disabled:opacity-40"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
                  <path
                    d="M4 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
