"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [pressed, setPressed] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 400, damping: 40 });
  const ringY = useSpring(y, { stiffness: 400, damping: 40 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    setEnabled(true);
    document.documentElement.classList.add("orv-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-cursor], a, button, [role='button'], input, textarea, select, label, summary"
      );
      setLabel(el?.dataset.cursor ?? null);
      setHovering(!!el);
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      document.documentElement.classList.remove("orv-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-100">
      {/* orb dot */}
      <motion.div
        style={{ x, y }}
        className="absolute top-0 left-0"
      >
        <motion.div
          animate={{ scale: pressed ? 0.6 : label ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, var(--color-corona-soft), var(--color-corona))",
            boxShadow: "0 0 12px rgba(255,139,61,0.8)",
          }}
        />
      </motion.div>
      {/* trailing ring / label pill */}
      <motion.div style={{ x: ringX, y: ringY }} className="absolute top-0 left-0">
        <motion.div
          animate={{
            scale: label ? 1 : hovering ? 1.5 : 1,
            width: label ? "auto" : 36,
            backgroundColor: label ? "rgba(234,232,227,0.96)" : "rgba(234,232,227,0)",
          }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-9 min-w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-moon/25 px-3"
        >
          {label && (
            <span className="mono-s text-night whitespace-nowrap text-[0.68rem] tracking-[0.14em] uppercase">
              {label}
            </span>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
