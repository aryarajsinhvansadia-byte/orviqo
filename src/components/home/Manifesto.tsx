"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "motion/react";

const TEXT =
  "Most of the internet is built to interrupt. We build the things people return to — websites that load before doubt does, brands that don't shout because they don't need to, and AI that works quietly in the back of the house. Noise gets attention. Craft keeps it.";

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}&nbsp;
    </motion.span>
  );
}

export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.82", "end 0.42"],
  });

  const words = TEXT.split(" ");

  return (
    <section className="on-dawn bg-dawn text-night">
      <div className="shell section">
        <div className="flex items-center gap-4 border-t border-inkline pt-4">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, var(--color-corona-soft), var(--color-corona))",
            }}
          />
          <span className="eyebrow text-night/55">The belief</span>
        </div>
        <div ref={ref} className="mt-14 max-w-5xl">
          <p className="display display-lg" style={{ lineHeight: 1.18 }}>
            {reduced
              ? TEXT
              : words.map((w, i) => (
                  <Word
                    key={i}
                    progress={scrollYProgress}
                    range={[i / words.length, Math.min((i + 6) / words.length, 1)]}
                  >
                    {w}
                  </Word>
                ))}
          </p>
        </div>
        <p className="serif-i mt-14 text-xl text-night/60">
          — This is what we mean by inevitable.
        </p>
      </div>
    </section>
  );
}
