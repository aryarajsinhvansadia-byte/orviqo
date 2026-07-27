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
 * An app being born, scrubbed by scroll. The section pins and the visitor's
 * scroll is the playhead; inside a phone frame the build assembles:
 *
 *   Week 0  The idea      — a sentence on a dark screen
 *   Week 2  Wireframes    — the skeleton draws itself
 *   Week 4  The build     — the interface arrives, still colourless
 *   Week 6  On the store  — light sweeps colour across it, the icon lands
 *
 * Same approach as the project timelapse: no video, just DOM layers driven
 * by scroll. Renders the final frame under reduced motion.
 */

const STAGES = [
  { week: "Week 0", label: "The idea" },
  { week: "Week 2", label: "Wireframes" },
  { week: "Week 4", label: "The build" },
  { week: "Week 6", label: "On the store" },
];

/* the phone's interface, drawn once and reused by every scene */
function AppScreen({ live }: { live: boolean }) {
  const accent = live ? "#ff8b3d" : "#4a4a52";
  const soft = live ? "rgba(255,139,61,0.16)" : "rgba(255,255,255,0.05)";
  return (
    <div className="flex h-full flex-col bg-[#0a0a10] px-4 pb-4 pt-9">
      {/* status row */}
      <div className="mb-4 flex items-center justify-between px-1">
        <span className="text-[8px] text-moon/50">9:41</span>
        <span className="flex gap-0.5">
          {[3, 5, 7].map((h) => (
            <span key={h} className="w-[2px] rounded-sm bg-moon/40" style={{ height: h }} />
          ))}
        </span>
      </div>

      {/* brand row */}
      <div className="mb-5 flex items-center gap-2">
        <span
          className="h-4 w-4 rounded-full"
          style={{
            background: live
              ? "radial-gradient(circle at 50% 50%, transparent 42%, #ff8b3d 52%, rgba(255,139,61,.2) 68%, transparent 74%)"
              : "radial-gradient(circle at 50% 50%, transparent 42%, #4a4a52 52%, transparent 72%)",
          }}
        />
        <span
          className="h-1.5 w-14 rounded-sm"
          style={{ background: live ? "rgba(234,232,227,.85)" : "#3a3a42" }}
        />
      </div>

      {/* hero card */}
      <div
        className="mb-3 h-24 w-full rounded-lg"
        style={{
          background: live
            ? "linear-gradient(140deg, rgba(255,139,61,.22), rgba(20,20,28,.9))"
            : "#1a1a22",
          border: `1px solid ${live ? "rgba(255,139,61,.28)" : "rgba(255,255,255,.06)"}`,
        }}
      />

      {/* rows */}
      <div className="space-y-2">
        {[100, 82, 64].map((w, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-md" style={{ background: soft }} />
            <span
              className="h-1.5 rounded-sm"
              style={{ width: `${w * 0.6}%`, background: live ? "rgba(234,232,227,.4)" : "#2e2e36" }}
            />
          </div>
        ))}
      </div>

      {/* primary action */}
      <div
        className="mt-auto flex h-8 items-center justify-center rounded-full"
        style={{ background: live ? "#eae8e3" : "#26262e" }}
      >
        <span
          className="h-1.5 w-16 rounded-sm"
          style={{ background: live ? "#0a0a10" : "#3a3a42" }}
        />
      </div>

      {/* tab bar */}
      <div className="mt-3 flex items-center justify-around border-t border-hairline pt-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-4 w-4 rounded-md"
            style={{ background: i === 0 ? accent : live ? "rgba(234,232,227,.2)" : "#2e2e36" }}
          />
        ))}
      </div>
    </div>
  );
}

export default function AppTimelapse() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  /* --- choreography --- */
  const ideaOpacity = useTransform(p, [0, 0.15, 0.24], [1, 1, 0]);
  const ideaY = useTransform(p, [0, 0.24], [0, -26]);

  // wireframe assembles top-down
  const wfTop = useTransform(p, [0.14, 0.2], [0, 1]);
  const wfHero = useTransform(p, [0.2, 0.27], [0, 1]);
  const wfRows = useTransform(p, [0.27, 0.34], [0, 1]);
  const wfTabs = useTransform(p, [0.34, 0.4], [0, 1]);
  const wfOut = useTransform(p, [0.5, 0.6], [1, 0]);

  const greyIn = useTransform(p, [0.46, 0.58], [0, 1]);

  // the scan of light that brings it to life
  const wipe = useTransform(p, [0.66, 0.9], [100, 0]);
  const clip = useMotionTemplate`inset(0 ${wipe}% 0 0)`;
  const scanX = useTransform(p, [0.66, 0.9], ["0%", "100%"]);
  const scanOpacity = useTransform(p, [0.64, 0.68, 0.89, 0.94], [0, 1, 1, 0]);

  // the finished icon landing on a home screen
  const iconScale = useTransform(p, [0.88, 0.97], [0.7, 1]);
  const iconOpacity = useTransform(p, [0.88, 0.96], [0, 1]);

  const activeStage = useTransform(p, [0, 0.25, 0.5, 0.75, 1], [0, 1, 2, 3, 3]);

  if (reduce) {
    return (
      <section className="shell section">
        <p className="eyebrow mb-4">The app timelapse</p>
        <h2 className="display display-lg">
          From an idea to <em className="serif-i not-italic">the home screen.</em>
        </h2>
        <div className="mt-12 flex justify-center">
          <div className="h-[420px] w-[220px] overflow-hidden rounded-[2rem] border-[6px] border-[#1a1a22] bg-night">
            <AppScreen live />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[360vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="shell">
          <p className="eyebrow mb-3">
            <ScrambleText text="The app timelapse" />
          </p>
          <h2 className="display display-lg max-w-xl">
            From an idea to <em className="serif-i not-italic">the home screen.</em>
          </h2>

          <div className="mt-10 flex justify-center">
            {/* phone */}
            <div className="relative">
              <div
                className="relative h-[440px] w-[228px] overflow-hidden rounded-[2.2rem] border-[7px] border-[#16161e] bg-[#0a0a10]"
                style={{ boxShadow: "0 30px 90px rgba(0,0,0,.6)" }}
              >
                {/* notch */}
                <div className="absolute left-1/2 top-0 z-30 h-4 w-20 -translate-x-1/2 rounded-b-xl bg-[#16161e]" />

                {/* scene 1 — the idea */}
                <motion.div
                  style={{ opacity: ideaOpacity, y: ideaY }}
                  className="absolute inset-0 z-20 flex items-center justify-center px-6 text-center"
                >
                  <p className="serif-i text-sm leading-relaxed text-moon/80">
                    &ldquo;Let patients book us from their phone — in ten seconds, at
                    any hour.&rdquo;
                  </p>
                </motion.div>

                {/* scene 2 — wireframe */}
                <motion.div style={{ opacity: wfOut }} className="absolute inset-0 z-10">
                  <div className="flex h-full flex-col px-4 pb-4 pt-9">
                    <motion.div style={{ opacity: wfTop }} className="mb-5 flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border border-[#3a3a42]" />
                      <span className="h-1.5 w-14 rounded-sm bg-[#2a2a32]" />
                    </motion.div>
                    <motion.div
                      style={{ opacity: wfHero }}
                      className="mb-3 h-24 w-full rounded-lg border border-dashed border-[#33333c]"
                    />
                    <motion.div style={{ opacity: wfRows }} className="space-y-2">
                      {[100, 82, 64].map((w, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="h-6 w-6 rounded-md border border-[#2e2e36]" />
                          <span
                            className="h-1.5 rounded-sm bg-[#26262e]"
                            style={{ width: `${w * 0.6}%` }}
                          />
                        </div>
                      ))}
                    </motion.div>
                    <motion.div
                      style={{ opacity: wfTabs }}
                      className="mt-auto flex items-center justify-around border-t border-[#22222a] pt-3"
                    >
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="h-4 w-4 rounded-md border border-[#2e2e36]" />
                      ))}
                    </motion.div>
                  </div>
                </motion.div>

                {/* scene 3 — built, colourless */}
                <motion.div style={{ opacity: greyIn }} className="absolute inset-0">
                  <AppScreen live={false} />
                </motion.div>

                {/* scene 4 — colour sweeps in */}
                <motion.div style={{ clipPath: clip }} className="absolute inset-0">
                  <AppScreen live />
                </motion.div>

                {/* the scan line */}
                <motion.div
                  style={{ left: scanX, opacity: scanOpacity }}
                  className="absolute inset-y-0 z-30 w-16 -translate-x-1/2"
                  aria-hidden
                >
                  <div className="h-full w-full bg-gradient-to-r from-transparent via-[rgba(255,139,61,.5)] to-transparent blur-[2px]" />
                </motion.div>
              </div>

              {/* the icon, landing */}
              <motion.div
                style={{ scale: iconScale, opacity: iconOpacity }}
                className="absolute -right-16 bottom-6 hidden text-center sm:block"
              >
                <span
                  className="mx-auto block h-14 w-14 rounded-[1rem]"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, #12121a 40%, rgba(255,139,61,.95) 52%, rgba(255,139,61,.16) 68%, #0a0a10 74%)",
                    boxShadow: "0 10px 30px rgba(255,139,61,.25)",
                  }}
                />
                <span className="mono-s mt-2 block text-ash">ORVIQO</span>
              </motion.div>
            </div>
          </div>

          {/* stage rail */}
          <div className="mt-10 grid grid-cols-2 gap-4 border-t border-hairline pt-5 sm:grid-cols-4">
            {STAGES.map((s, i) => (
              <Stage key={s.week} stage={s} index={i} active={activeStage} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stage({
  stage,
  index,
  active,
}: {
  stage: { week: string; label: string };
  index: number;
  active: ReturnType<typeof useTransform<number, number>>;
}) {
  const opacity = useTransform(active, (v) => (v >= index ? 1 : 0.32));
  return (
    <motion.div style={{ opacity }}>
      <p className="mono-s text-corona-soft/80">{stage.week}</p>
      <p className="mt-1 text-sm text-moon">{stage.label}</p>
    </motion.div>
  );
}
