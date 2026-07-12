"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Project } from "@/lib/projects";
import ProjectArt from "@/components/ProjectArt";
import { startScroll, stopScroll } from "@/components/SmoothScroll";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * A gallery-viewing layer for the work index. It lets someone taste the
 * thinking behind a project before committing to the full case study.
 */
export default function ProjectPreview({
  project,
  position,
  total,
  onClose,
  onBrowse,
}: {
  project: Project | null;
  position: number;
  total: number;
  onClose: () => void;
  onBrowse: (direction: -1 | 1) => void;
}) {
  const reduced = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;
    stopScroll();
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onBrowse(-1);
      if (event.key === "ArrowRight") onBrowse(1);
    };
    window.addEventListener("keydown", onKey);
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 80);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
      document.body.style.overflow = "";
      startScroll();
    };
  }, [project, onBrowse, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${project.client} project preview`}
          className="fixed inset-0 z-90 overflow-y-auto bg-night"
          initial={reduced ? false : { clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: reduced ? 0 : 0.75, ease: EASE }}
        >
          <div className="relative min-h-svh">
            <ProjectArt
              {...project.art}
              fill
              className="absolute inset-0 brightness-125 contrast-125 saturate-125"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(10,10,16,0.78) 0%, rgba(10,10,16,0.2) 58%, rgba(10,10,16,0.64) 100%)",
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-2/3"
              style={{
                background:
                  "linear-gradient(to top, rgba(10,10,16,1) 0%, rgba(10,10,16,0.7) 42%, transparent 100%)",
              }}
            />

            <div className="shell relative flex min-h-svh flex-col py-6 md:py-8">
              <div className="flex items-center justify-between">
                <p className="mono-s text-moon/70">
                  Exhibit {String(position + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </p>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  className="group flex items-center gap-3 rounded-full border border-moon/20 px-4 py-2 text-moon transition-colors hover:border-moon/50"
                >
                  <span className="mono-s">Close</span>
                  <span aria-hidden className="text-lg leading-none transition-transform duration-300 group-hover:rotate-90">
                    ×
                  </span>
                </button>
              </div>

              <div className="mt-auto max-w-4xl pt-32 md:pt-48">
                <motion.p
                  className="eyebrow mb-6 text-moon/70"
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: reduced ? 0 : 0.2, ease: EASE }}
                >
                  {project.sector} · {project.location} · {project.year}
                </motion.p>
                <motion.h2
                  className="display display-hero"
                  initial={reduced ? false : { opacity: 0, y: 36 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: reduced ? 0 : 0.26, ease: EASE }}
                >
                  {project.client}
                </motion.h2>
                <motion.p
                  className="serif-i mt-4 max-w-2xl text-[clamp(1.4rem,2.8vw,2.3rem)] leading-tight text-corona-soft"
                  initial={reduced ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: reduced ? 0 : 0.36, ease: EASE }}
                >
                  {project.narrative}
                </motion.p>
              </div>

              <motion.div
                className="mt-10 grid gap-8 border-t border-moon/20 pt-6 md:grid-cols-[1.25fr_1fr_auto] md:items-end"
                initial={reduced ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: reduced ? 0 : 0.46, ease: EASE }}
              >
                <p className="max-w-xl text-moon/75">{project.summary}</p>
                <dl className="grid grid-cols-3 gap-4">
                  {project.metrics.slice(0, 3).map((metric) => (
                    <div key={metric.label}>
                      <dd className="display light-text text-xl leading-none">{metric.value}</dd>
                      <dt className="mt-2 text-xs leading-tight text-moon/60">{metric.label}</dt>
                    </div>
                  ))}
                </dl>
                <Link
                  href={`/work/${project.slug}/`}
                  className="group inline-flex items-center gap-3 self-end rounded-full bg-moon px-5 py-3 font-medium text-night transition-colors hover:bg-corona-soft"
                >
                  Read the case study
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>

              <div className="mt-8 flex justify-between border-t border-moon/15 pt-5">
                <button
                  type="button"
                  onClick={() => onBrowse(-1)}
                  className="mono-s text-moon/65 transition-colors hover:text-moon"
                >
                  ← Previous
                </button>
                <span className="mono-s hidden text-moon/45 sm:block">Use ← → to browse</span>
                <button
                  type="button"
                  onClick={() => onBrowse(1)}
                  className="mono-s text-moon/65 transition-colors hover:text-moon"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
