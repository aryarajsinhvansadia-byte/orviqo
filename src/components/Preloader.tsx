"use client";

import { useEffect, useState } from "react";

/**
 * First-visit loading scene. CSS-driven (not rAF) so it always completes,
 * even in throttled background tabs; hard unmount as a final guarantee.
 */
export default function Preloader() {
  const [phase, setPhase] = useState<"idle" | "play" | "exit" | "gone">("idle");

  useEffect(() => {
    if (
      sessionStorage.getItem("orv-seen") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setPhase("gone");
      return;
    }
    sessionStorage.setItem("orv-seen", "1");
    setPhase("play");
    const t1 = setTimeout(() => setPhase("exit"), 1400);
    const t2 = setTimeout(() => setPhase("gone"), 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-90 flex items-center justify-center bg-night transition-transform duration-[850ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
      style={{ transform: phase === "exit" ? "translateY(-100%)" : "translateY(0)" }}
    >
      {phase !== "idle" && (
        <div className="flex flex-col items-center gap-6">
          <div
            className="h-3 w-3 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, var(--color-corona-soft), var(--color-corona))",
              boxShadow: "0 0 28px 6px rgba(255,139,61,0.55)",
              animation: "pre-dot 0.7s cubic-bezier(0.22,1,0.36,1) both",
            }}
          />
          <div className="overflow-hidden">
            <span
              className="display block text-2xl tracking-[0.3em] text-moon"
              style={{ animation: "pre-word 0.8s cubic-bezier(0.22,1,0.36,1) 0.15s both" }}
            >
              ORVIQO
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
