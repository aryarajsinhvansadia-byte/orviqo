"use client";

import { useEffect, useState } from "react";

/**
 * Registers the service worker and, once the browser decides the site is
 * installable, offers a quiet prompt to add ORVIQO to the home screen.
 * Dismissal is remembered so it never nags.
 */
type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "orviqo-install-dismissed";

export default function InstallApp() {
  const [deferred, setDeferred] = useState<InstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      if (localStorage.getItem(DISMISS_KEY)) return;
      setDeferred(e as InstallPromptEvent);
      // let the page settle before offering
      setTimeout(() => setVisible(true), 2500);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", () => setVisible(false));
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {}
  }

  async function install() {
    if (!deferred) return;
    setVisible(false);
    await deferred.prompt();
    await deferred.userChoice.catch(() => null);
    setDeferred(null);
  }

  if (!visible || !deferred) return null;

  return (
    <div
      role="dialog"
      aria-label="Install ORVIQO"
      className="fixed inset-x-4 bottom-4 z-90 mx-auto flex max-w-md items-center gap-4 rounded-[4px] border border-hairline bg-night/95 px-4 py-3.5 backdrop-blur-md md:left-6 md:right-auto"
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
        <p className="text-sm font-medium text-moon">Add ORVIQO to your home screen</p>
        <p className="mono-s text-ash">Opens like an app. Works offline.</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={dismiss}
          className="mono-s text-ash transition-colors hover:text-moon"
          aria-label="Not now"
        >
          Not now
        </button>
        <button
          onClick={install}
          className="rounded-full bg-moon px-4 py-2 text-sm font-medium text-night transition-colors hover:bg-corona-soft"
        >
          Add
        </button>
      </div>
    </div>
  );
}
