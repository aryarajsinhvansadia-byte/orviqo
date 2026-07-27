"use client";

import { useEffect, useState } from "react";
import { checkNative, registerPush, tap } from "@/lib/native";

const ASKED_KEY = "orviqo-push-asked";

/**
 * Runs only inside the ORVIQO app. Marks the document so native-only styling
 * can apply, and offers notifications once — never on the web, never twice.
 */
export default function AppFeatures() {
  const [native, setNative] = useState(false);
  const [offer, setOffer] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const isNative = await checkNative();
      if (cancelled || !isNative) return;
      setNative(true);
      document.documentElement.dataset.orviqoApp = "true";

      let asked = false;
      try {
        asked = localStorage.getItem(ASKED_KEY) === "1";
      } catch {}
      if (!asked) setTimeout(() => setOffer(true), 4000);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function enable() {
    void tap();
    setOffer(false);
    try {
      localStorage.setItem(ASKED_KEY, "1");
    } catch {}
    const ok = await registerPush((token) => {
      // Register the device against the studio inbox so replies can reach it.
      fetch("/api/push-token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, platform: "app" }),
      }).catch(() => {});
    });
    setEnabled(ok);
  }

  function dismiss() {
    setOffer(false);
    try {
      localStorage.setItem(ASKED_KEY, "1");
    } catch {}
  }

  if (!native || !offer || enabled) return null;

  return (
    <div
      role="dialog"
      aria-label="Enable notifications"
      className="fixed inset-x-4 bottom-4 z-90 mx-auto flex max-w-md items-center gap-4 rounded-[4px] border border-hairline bg-night/95 px-4 py-3.5 backdrop-blur-md"
      style={{ boxShadow: "0 18px 60px rgba(0,0,0,0.55)" }}
    >
      <span
        aria-hidden
        className="h-9 w-9 shrink-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 44%, rgba(255,139,61,0.95) 53%, rgba(255,139,61,0.15) 68%, transparent 74%)",
        }}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-moon">Get notified</p>
        <p className="mono-s text-ash">
          When your consultation is confirmed, or your project moves.
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button onClick={dismiss} className="mono-s text-ash transition-colors hover:text-moon">
          No thanks
        </button>
        <button
          onClick={enable}
          className="rounded-full bg-moon px-4 py-2 text-sm font-medium text-night transition-colors hover:bg-corona-soft"
        >
          Allow
        </button>
      </div>
    </div>
  );
}
