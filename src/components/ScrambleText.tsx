"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Text that decrypts. On first sight (and on hover) each character settles from
 * random glyphs into the real letter, left to right — a signature "intelligent
 * system resolving" motif, fitting for a studio that builds them. Cheap: one
 * interval, plain characters. Renders the final text instantly under
 * reduced-motion.
 */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>*+#";
const DURATION = 820; // ms — the whole decrypt, regardless of length

export default function ScrambleText({
  text,
  className = "",
  as: Tag = "span",
  speed = 34,
}: {
  text: string;
  className?: string;
  as?: "span" | "p" | "h2" | "h3";
  speed?: number;
}) {
  const [out, setOut] = useState(text);
  const ref = useRef<HTMLElement>(null);
  const raf = useRef<number>(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const played = useRef(false);

  const run = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOut(text);
      return;
    }
    if (timer.current) clearInterval(timer.current);
    const total = text.length;
    // Time-bounded: any length resolves in ~DURATION, so long labels never drag.
    const steps = Math.max(1, Math.round(DURATION / speed));
    let frame = 0;
    timer.current = setInterval(() => {
      frame++;
      const revealed = Math.floor((frame / steps) * total);
      let next = "";
      for (let i = 0; i < total; i++) {
        const ch = text[i];
        if (ch === " ") next += " ";
        else if (i < revealed) next += ch;
        else next += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOut(next);
      if (frame >= steps) {
        setOut(text);
        if (timer.current) clearInterval(timer.current);
      }
    }, speed);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !played.current) {
          played.current = true;
          run();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer.current) clearInterval(timer.current);
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <Tag
      ref={ref as never}
      className={className}
      onMouseEnter={run}
      aria-label={text}
    >
      <span aria-hidden>{out}</span>
    </Tag>
  );
}
