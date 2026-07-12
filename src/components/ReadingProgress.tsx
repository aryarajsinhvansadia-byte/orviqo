"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** A thin line of corona light that fills as the story is read. */
export default function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 130, damping: 30 });

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-85 h-[2px] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #ffd9a3, #ff8b3d)",
        boxShadow: "0 0 12px rgba(255,139,61,0.5)",
      }}
    />
  );
}
