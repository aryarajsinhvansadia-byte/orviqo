/**
 * The languages ORVIQO's assistant listens and replies in.
 *
 * Two different browser systems are involved and they have very different
 * coverage, which is why each language declares them separately:
 *
 *   stt  — speech recognition. Chrome handles all four of these well.
 *   tts  — speech synthesis. Coverage is patchy and device-dependent.
 *
 * The tts fallback chains are deliberate, not decorative. Marathi and Hindi
 * share the Devanagari script, so a Hindi voice can read Marathi acceptably
 * (the accent is off, the words are right). Gujarati has its own script, so
 * no other voice can read it — the chain stops rather than handing Gujarati
 * text to a voice that would mangle it. When a chain comes up empty the UI
 * says so and keeps listening; it just doesn't speak back.
 */

export type LangCode = "en-IN" | "hi-IN" | "gu-IN" | "mr-IN";

export type VoiceLang = {
  code: LangCode;
  /** Shown in the picker, in its own script. */
  label: string;
  /** BCP-47 tag handed to SpeechRecognition. */
  stt: string;
  /** Acceptable speech-synthesis language prefixes, best first. */
  ttsPrefixes: string[];
  /** How the assistant opens in this language. */
  greeting: string;
  /** Placeholder for the text input. */
  placeholder: string;
  /** Appended to the message so the agent answers in kind. */
  directive: string | null;
};

export const VOICE_LANGS: VoiceLang[] = [
  {
    code: "en-IN",
    label: "English",
    stt: "en-IN",
    ttsPrefixes: ["en-IN", "en-GB", "en-US", "en"],
    greeting:
      "Hello — I'm ORVIQO's assistant. Tell me about your business and what you'd like to build, and I can book you a free consultation right here.",
    placeholder: "Tell me about your business…",
    directive: null,
  },
  {
    code: "hi-IN",
    label: "हिंदी",
    stt: "hi-IN",
    ttsPrefixes: ["hi-IN", "hi"],
    greeting:
      "नमस्ते — मैं ORVIQO का असिस्टेंट हूँ। अपने बिज़नेस के बारे में बताइए और आप क्या बनवाना चाहते हैं। मैं यहीं आपकी फ़्री कंसल्टेशन बुक कर सकता हूँ।",
    placeholder: "अपने बिज़नेस के बारे में बताइए…",
    directive: "Reply in Hindi (हिंदी), written in Devanagari script. Keep it natural and spoken.",
  },
  {
    code: "gu-IN",
    label: "ગુજરાતી",
    stt: "gu-IN",
    // Gujarati script — no other voice can read it, so the chain ends here.
    ttsPrefixes: ["gu-IN", "gu"],
    greeting:
      "નમસ્તે — હું ORVIQO નો આસિસ્ટન્ટ છું. તમારા બિઝનેસ વિશે અને તમે શું બનાવવા માંગો છો તે જણાવો. હું અહીં જ તમારું ફ્રી કન્સલ્ટેશન બુક કરી શકું છું.",
    placeholder: "તમારા બિઝનેસ વિશે જણાવો…",
    directive:
      "Reply in Gujarati (ગુજરાતી), written in Gujarati script. Keep it natural and spoken.",
  },
  {
    code: "mr-IN",
    label: "मराठी",
    stt: "mr-IN",
    // Devanagari, so a Hindi voice is an imperfect but intelligible last resort.
    ttsPrefixes: ["mr-IN", "mr", "hi-IN", "hi"],
    greeting:
      "नमस्कार — मी ORVIQO चा असिस्टंट आहे. तुमच्या व्यवसायाबद्दल आणि तुम्हाला काय बनवायचं आहे ते सांगा. मी इथेच तुमचं मोफत कन्सल्टेशन बुक करू शकतो.",
    placeholder: "तुमच्या व्यवसायाबद्दल सांगा…",
    directive: "Reply in Marathi (मराठी), written in Devanagari script. Keep it natural and spoken.",
  },
];

export const DEFAULT_LANG = VOICE_LANGS[0];

export function langByCode(code: LangCode): VoiceLang {
  return VOICE_LANGS.find((l) => l.code === code) ?? DEFAULT_LANG;
}

/**
 * Best available synthesis voice for a language, or null when the device has
 * nothing that can read this script. Callers must treat null as "stay silent"
 * rather than falling back to any voice at all.
 */
export function pickVoice(
  lang: VoiceLang,
  all: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | null {
  if (!all.length) return null;
  for (const prefix of lang.ttsPrefixes) {
    // Exact tag first (gu-IN), then the bare language (gu).
    const exact = all.find((v) => v.lang.replace("_", "-").toLowerCase() === prefix.toLowerCase());
    if (exact) return exact;
    const loose = all.find((v) =>
      v.lang.replace("_", "-").toLowerCase().startsWith(prefix.split("-")[0].toLowerCase())
    );
    if (loose) return loose;
  }
  return null;
}

/**
 * Attaches the reply-language instruction, if the language needs one.
 *
 * This used to carry a second note correcting the assistant's belief that it
 * was text-only. That belonged in the n8n workflow's own prompt, which now
 * says it — so the note is gone rather than duplicated in two places that
 * could drift apart.
 */
export function withDirective(message: string, lang: VoiceLang): string {
  return lang.directive ? `${message}\n\n[${lang.directive}]` : message;
}

/** Split a reply into speakable chunks so synthesis starts sooner. */
export function toSpeechChunks(text: string): string[] {
  return text
    .replace(/[*_#`]/g, "")
    .split(/(?<=[.!?।])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
