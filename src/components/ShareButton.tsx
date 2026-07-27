"use client";

import { useState } from "react";
import { share, tap } from "@/lib/native";

/**
 * Shares the current page. Uses the OS share sheet inside the ORVIQO app,
 * the Web Share API on mobile browsers, and copies the link otherwise.
 */
export default function ShareButton({
  title,
  text,
  url,
  label = "Share",
  className = "",
}: {
  title: string;
  text?: string;
  url?: string;
  label?: string;
  className?: string;
}) {
  const [note, setNote] = useState<string | null>(null);

  async function onShare() {
    void tap();
    const target =
      url ?? (typeof window !== "undefined" ? window.location.href : "https://orviqo.net");
    const how = await share({ title, text, url: target });
    if (how === "copied") {
      setNote("Link copied");
      setTimeout(() => setNote(null), 2200);
    } else if (how === "failed") {
      setNote("Couldn't share");
      setTimeout(() => setNote(null), 2200);
    }
  }

  return (
    <span className="inline-flex items-center gap-3">
      <button
        type="button"
        onClick={onShare}
        className={`mono-s inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 text-ash transition-colors hover:border-moon/30 hover:text-moon ${className}`}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
          <path
            d="M12 3v13M12 3 8 7M12 3l4 4M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {label}
      </button>
      {note && (
        <span className="mono-s text-corona-soft" role="status">
          {note}
        </span>
      )}
    </span>
  );
}
