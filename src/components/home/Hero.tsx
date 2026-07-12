"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import Button from "@/components/Button";
import Orb from "@/components/Orb";
import { MaskLines } from "@/components/motion";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-svh flex-col justify-end overflow-hidden"
      id="top"
    >
      {/* the eclipse */}
      <motion.div
        style={reduced ? undefined : { y: orbY, opacity: fade }}
        className="absolute right-[-12%] top-[8%] w-[min(58vmin,34rem)] max-md:right-[-30%] max-md:top-[4%] max-md:w-[72vmin]"
      >
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <Orb variant="eclipse" className="w-full" />
        </motion.div>
      </motion.div>

      <div className="shell relative pb-12 pt-36">
        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="eyebrow mb-8"
        >
          Independent digital studio — working worldwide
        </motion.p>

        <MaskLines
          as="h1"
          className="display display-hero max-w-[11ch]"
          delay={0.55}
          eager
          lines={[
            <span key="l1">
              The <em className="serif-i not-italic">quiet</em> kind
            </span>,
            <span key="l2">of famous.</span>,
          ]}
        />

        <div className="mt-10 flex flex-wrap items-end justify-between gap-10">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-md text-lg text-ash"
          >
            Websites, brands and AI systems engineered for companies that would
            rather be remembered than merely noticed.
          </motion.p>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-4"
          >
            <Button href="/contact/">Start a project</Button>
            <Button href="/work/" variant="ghost">
              See the work
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="mt-14 flex items-center justify-between border-t border-hairline pt-5 text-ash"
        >
          <span className="mono-s flex items-center gap-3">
            <motion.span
              aria-hidden
              animate={reduced ? undefined : { y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              ↓
            </motion.span>
            Scroll
          </span>
          <span className="mono-s max-sm:hidden">Design · Engineering · AI · SEO</span>
        </motion.div>
      </div>
    </section>
  );
}
