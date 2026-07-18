"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "motion/react";
import ScrambleText from "@/components/ScrambleText";

/**
 * The timelapse — a scroll-directed film of a project being born.
 * The section pins; the visitor's scroll is the playhead. Inside a browser
 * frame, the Reva Diagnostics build assembles in four scenes:
 *
 *   Week 0  The brief        — words on a dark screen
 *   Week 1  Wireframes       — a skeleton draws itself, matching the real layout
 *   Week 3  The build        — the actual site appears as a blueprint
 *   Week 6  Live             — a scan of light sweeps colour across it
 *
 * No video files: the "footage" is DOM layers scrubbed by scroll — 60fps,
 * zero download weight. Under reduced motion it renders the final frame.
 */

const STAGES = [
  { week: "Week 0", label: "The brief" },
  { week: "Week 1", label: "Wireframes" },
  { week: "Week 3", label: "The build" },
  { week: "Week 6", label: "Live" },
];

export default function ProjectTimelapse() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // --- scene choreography ---------------------------------------------
  const briefOpacity = useTransform(p, [0, 0.16, 0.26], [1, 1, 0]);
  const briefY = useTransform(p, [0, 0.26], [0, -30]);

  // wireframe assembles in four strokes, then hands over to the build
  const wfNav = useTransform(p, [0.14, 0.19], [0, 1]);
  const wfHead = useTransform(p, [0.19, 0.25], [0, 1]);
  const wfCard = useTransform(p, [0.25, 0.31], [0, 1]);
  const wfRest = useTransform(p, [0.31, 0.37], [0, 1]);
  const wfOut = useTransform(p, [0.52, 0.62], [1, 0]);

  const greyIn = useTransform(p, [0.48, 0.6], [0, 1]);

  // the scan of light that develops the site into colour
  const wipe = useTransform(p, [0.68, 0.93], [100, 0]);
  const clip = useMotionTemplate`inset(0 ${wipe}% 0 0)`;
  const scanX = useTransform(p, [0.68, 0.93], ["0%", "100%"]);
  const scanOpacity = useTransform(p, [0.66, 0.7, 0.92, 0.96], [0, 1, 1, 0]);

  const frameScale = useTransform(p, [0.9, 1], [1.015, 1]);

  // url bar morphs with the story
  const urlDraft = useTransform(p, [0.6, 0.68], [1, 0]);
  const urlLive = useTransform(p, [0.68, 0.75], [0, 1]);

  // stage rail
  const railFill = useTransform(p, [0, 1], ["0%", "100%"]);
  const s0 = useTransform(p, [0, 0.24, 0.28], [1, 1, 0.35]);
  const s1 = useTransform(p, [0.24, 0.28, 0.5, 0.54], [0.35, 1, 1, 0.35]);
  const s2 = useTransform(p, [0.5, 0.54, 0.7, 0.74], [0.35, 1, 1, 0.35]);
  const s3 = useTransform(p, [0.7, 0.74, 1], [0.35, 1, 1]);
  const stageOpacities = [s0, s1, s2, s3];

  // Reduced motion: the final frame, plainly.
  if (reduce) {
    return (
      <section className="shell section">
        <p className="eyebrow mb-8">The timelapse</p>
        <h2 className="display display-xl max-w-3xl">
          From first sketch <em className="serif-i not-italic">to shipped.</em>
        </h2>
        <div className="mt-12 overflow-hidden rounded-lg border border-hairline bg-slate">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/work/reva-diagnostics.jpg"
            alt="Reva Diagnostics — the shipped site"
            className="w-full"
            loading="lazy"
          />
        </div>
        <p className="mono-s mt-4 text-ash">
          Reva Diagnostics — brief to live in six weeks.
        </p>
      </section>
    );
  }

  return (
    <section ref={ref} aria-label="Project timelapse" className="relative h-[380vh]">
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        <div className="shell flex min-h-0 flex-1 flex-col pt-20 md:pt-24">
          {/* header */}
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <ScrambleText as="p" text="The timelapse" className="eyebrow" />
              <h2 className="display display-lg mt-3">
                From first sketch <em className="serif-i not-italic">to shipped.</em>
              </h2>
            </div>
            <p className="mono-s hidden text-ash md:block">
              Scroll — you&apos;re the director
            </p>
          </div>

          {/* the screen */}
          <motion.div
            style={{ scale: frameScale }}
            className="relative mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col overflow-hidden rounded-xl border border-hairline bg-slate shadow-[0_40px_120px_rgba(0,0,0,0.5)]"
          >
            {/* browser chrome */}
            <div className="flex items-center gap-3 border-b border-hairline px-4 py-2.5">
              <span className="flex gap-1.5">
                <i className="h-2.5 w-2.5 rounded-full bg-moon/15" />
                <i className="h-2.5 w-2.5 rounded-full bg-moon/15" />
                <i className="h-2.5 w-2.5 rounded-full bg-moon/15" />
              </span>
              <span className="relative mx-auto grid h-6 w-56 place-items-center overflow-hidden rounded-md bg-night text-center">
                <motion.span style={{ opacity: urlDraft }} className="mono-s absolute text-[0.62rem] text-ash">
                  reva — wireframe.fig
                </motion.span>
                <motion.span style={{ opacity: urlLive }} className="mono-s absolute text-[0.62rem] text-corona-soft">
                  revadiagnostics.com
                </motion.span>
              </span>
              <span className="w-10" />
            </div>

            {/* stage viewport */}
            <div className="relative min-h-0 flex-1 bg-night">
              {/* SCENE 3: blueprint of the real site */}
              <motion.div style={{ opacity: greyIn }} className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/work/reva-diagnostics.jpg"
                  alt=""
                  aria-hidden
                  className="h-full w-full object-cover object-top opacity-70 grayscale"
                />
                <div className="absolute inset-0 bg-[#101828]/55 mix-blend-multiply" />
              </motion.div>

              {/* SCENE 4: colour, revealed by the scan */}
              <motion.div style={{ clipPath: clip }} className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/work/reva-diagnostics.jpg"
                  alt="Reva Diagnostics — the live site"
                  className="h-full w-full object-cover object-top"
                />
              </motion.div>

              {/* the scan line */}
              <motion.div
                aria-hidden
                style={{ left: scanX, opacity: scanOpacity }}
                className="absolute inset-y-0 w-px"
              >
                <div className="h-full w-px bg-corona-soft shadow-[0_0_24px_4px_rgba(255,139,61,0.65)]" />
              </motion.div>

              {/* SCENE 2: the wireframe skeleton (matches the real layout) */}
              <motion.div style={{ opacity: wfOut }} className="absolute inset-0">
                <svg
                  viewBox="0 0 800 500"
                  preserveAspectRatio="xMidYMin slice"
                  className="h-full w-full"
                  aria-hidden
                >
                  <g stroke="rgba(234,232,227,0.5)" fill="none" strokeWidth="1.5">
                    <motion.g style={{ opacity: wfNav }}>
                      <rect x="0" y="0" width="800" height="44" />
                      <rect x="28" y="14" width="70" height="16" rx="3" />
                      {[220, 290, 360, 430, 500, 570].map((x) => (
                        <line key={x} x1={x} y1="22" x2={x + 44} y2="22" />
                      ))}
                      <rect x="680" y="10" width="92" height="24" rx="12" />
                    </motion.g>
                    <motion.g style={{ opacity: wfHead }}>
                      <rect x="56" y="96" width="150" height="10" rx="2" />
                      <rect x="56" y="126" width="280" height="34" rx="4" />
                      <rect x="56" y="172" width="310" height="34" rx="4" />
                      <rect x="56" y="218" width="250" height="34" rx="4" />
                    </motion.g>
                    <motion.g style={{ opacity: wfCard }}>
                      <rect x="470" y="96" width="280" height="300" rx="10" />
                      <polyline points="500,210 560,210 580,170 600,245 620,196 640,210 720,210" stroke="rgba(255,139,61,0.75)" />
                      <rect x="495" y="280" width="110" height="42" rx="6" />
                      <rect x="620" y="280" width="110" height="42" rx="6" />
                      <rect x="495" y="336" width="110" height="42" rx="6" />
                      <rect x="620" y="336" width="110" height="42" rx="6" />
                    </motion.g>
                    <motion.g style={{ opacity: wfRest }}>
                      {[280, 300, 320].map((y) => (
                        <line key={y} x1="56" y1={y} x2="400" y2={y} />
                      ))}
                      <rect x="56" y="352" width="130" height="36" rx="18" />
                      <rect x="202" y="352" width="130" height="36" rx="18" />
                    </motion.g>
                  </g>
                </svg>
              </motion.div>

              {/* SCENE 1: the brief */}
              <motion.div
                style={{ opacity: briefOpacity, y: briefY }}
                className="absolute inset-0 grid place-items-center bg-night px-8"
              >
                <div className="max-w-md text-center">
                  <p className="mono-s text-corona-soft/90">reva/brief.txt</p>
                  <p className="serif-i mt-5 text-xl leading-relaxed text-moon/90 md:text-2xl">
                    &ldquo;Give a medical-supply company a digital front door
                    that institutional buyers trust.&rdquo;
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* stage rail */}
          <div className="mx-auto mt-5 w-full max-w-4xl pb-8">
            <div className="relative h-px w-full bg-hairline">
              <motion.div
                style={{ width: railFill }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-corona-soft to-corona"
              />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {STAGES.map((s, i) => (
                <motion.div key={s.label} style={{ opacity: stageOpacities[i] }}>
                  <p className="mono-s text-corona-soft/80 max-sm:text-[0.55rem]">{s.week}</p>
                  <p className="mono-s text-moon max-sm:text-[0.55rem]">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
