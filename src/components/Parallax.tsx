"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * Slow drift inside a masked frame — images move like camera pans,
 * not like page furniture. Children are over-scaled so the pan never
 * exposes an edge.
 */
export default function Parallax({
  children,
  amount = 0.07,
  className = "",
}: {
  children: ReactNode;
  amount?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${amount * 100}%`, `${amount * 100}%`]
  );

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        style={reduced ? undefined : { y, scale: 1 + amount * 2.2 }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
