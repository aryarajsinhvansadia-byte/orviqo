"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { testimonials } from "@/lib/content";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const t = testimonials[index];
  const go = (dir: 1 | -1) =>
    setIndex((index + dir + testimonials.length) % testimonials.length);

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
          <span className="eyebrow text-night/55">Client voices</span>
        </div>

        <div className="mt-14 min-h-[16rem] md:min-h-[14rem]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.figure
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <blockquote className="serif-i max-w-4xl text-[clamp(1.6rem,3.4vw,2.9rem)] leading-[1.25]">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-8">
                <span className="font-medium">{t.author}</span>
                <span className="text-night/55"> — {t.role}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-inkline pt-6">
          <span className="mono-s tabular-nums text-night/55">
            {String(index + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
          </span>
          <div className="flex gap-3">
            <button
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-inkline transition-colors hover:bg-night hover:text-dawn"
            >
              ←
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-inkline transition-colors hover:bg-night hover:text-dawn"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
