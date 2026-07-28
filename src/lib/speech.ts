import type { VoiceLang } from "@/lib/voice-langs";

/**
 * One mouth for the assistant, wherever it's speaking from.
 *
 * Two sources, tried in order:
 *   1. /api/speak/ — the studio's own voice. Covers all four languages on
 *      every device, including Gujarati, which no Mac can speak natively.
 *   2. The browser's built-in voice, when the server voice isn't configured.
 *
 * The first 503 from the route latches `serverOk` to false so we stop paying
 * a round trip per sentence for a voice that isn't there. If neither source
 * can speak a script, play() resolves anyway — callers depend on it settling
 * so the listen → think → speak loop keeps turning instead of hanging.
 */

/* --- speech recognition: still not in the standard TS lib --- */

type SRAlternative = { transcript: string };
type SRResult = { isFinal: boolean; 0: SRAlternative };
export type SREvent = {
  resultIndex: number;
  results: { length: number; [i: number]: SRResult };
};
export type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives?: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: SREvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};
export type RecognitionCtor = new () => Recognition;

/** The browser's recogniser, or null where there isn't one (Firefox). */
export function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export type Speaker = {
  /** Resolves when the chunk has finished playing, or immediately if it can't. */
  play: (text: string, lang: VoiceLang, fallback: SpeechSynthesisVoice | null) => Promise<void>;
  cancel: () => void;
  /** null until the server voice has been tried once. */
  serverOk: () => boolean | null;
};

export function createSpeaker(): Speaker {
  let audio: HTMLAudioElement | null = null;
  let serverOk: boolean | null = null;
  // Bumped on cancel; anything from an older generation is discarded.
  let generation = 0;

  function stop() {
    generation += 1;
    if (audio) {
      audio.pause();
      if (audio.src.startsWith("blob:")) URL.revokeObjectURL(audio.src);
      audio = null;
    }
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
  }

  async function viaServer(text: string, lang: VoiceLang, mine: number): Promise<boolean> {
    if (serverOk === false) return false;
    let url: string;
    try {
      const res = await fetch("/api/speak/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang: lang.code }),
      });
      if (res.status === 503) {
        serverOk = false; // not configured — don't ask again
        return false;
      }
      if (!res.ok) return false;
      serverOk = true;
      url = URL.createObjectURL(await res.blob());
    } catch {
      return false;
    }

    if (mine !== generation) {
      URL.revokeObjectURL(url);
      return true; // cancelled mid-flight; treat as handled
    }

    await new Promise<void>((resolve) => {
      const el = new Audio(url);
      audio = el;
      const done = () => {
        URL.revokeObjectURL(url);
        if (audio === el) audio = null;
        resolve();
      };
      el.onended = done;
      el.onerror = done;
      el.play().catch(done);
    });
    return true;
  }

  function viaBrowser(
    text: string,
    fallback: SpeechSynthesisVoice | null,
    mine: number
  ): Promise<void> {
    // No voice for this script: better silent than mangled.
    if (!fallback || typeof window === "undefined" || !window.speechSynthesis) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      if (mine !== generation) return resolve();
      const u = new SpeechSynthesisUtterance(text);
      u.voice = fallback;
      u.lang = fallback.lang;
      u.rate = 1.02;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      window.speechSynthesis.speak(u);
    });
  }

  return {
    async play(text, lang, fallback) {
      const t = text.trim();
      if (!t) return;
      const mine = generation;
      if (await viaServer(t, lang, mine)) return;
      if (mine !== generation) return;
      await viaBrowser(t, fallback, mine);
    },
    cancel: stop,
    serverOk: () => serverOk,
  };
}
