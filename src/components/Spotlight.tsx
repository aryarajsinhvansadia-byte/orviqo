"use client";

import { useRef, type ReactNode } from "react";

/**
 * A surface that lights up under the cursor — a soft corona glow that tracks
 * the mouse within the element. Used on cards and tiles for that "the surface
 * knows you're there" feel. Pure CSS variables, no re-renders.
 */
export default function Spotlight({
  children,
  className = "",
  radius = 260,
}: {
  children: ReactNode;
  className?: string;
  radius?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={`group/spot relative overflow-hidden ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background: `radial-gradient(${radius}px circle at var(--mx, 50%) var(--my, 50%), rgba(255,139,61,0.14), transparent 62%)`,
        }}
      />
      {children}
    </div>
  );
}
