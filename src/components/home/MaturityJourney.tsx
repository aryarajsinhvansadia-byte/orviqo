"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import SectionHead from "@/components/SectionHead";
import { Rise } from "@/components/motion";

/**
 * The AI maturity journey — five levels a business climbs, with a corona
 * current that rises alongside as the visitor scrolls. The message: wherever
 * you stand today, this is one continuous road and one partner.
 */
const LEVELS = [
  {
    level: "Level 1",
    name: "Digital presence",
    tools: "A website that earns trust",
    body: "A fast, credible home on the web — the foundation everything else compounds on.",
  },
  {
    level: "Level 2",
    name: "Digital growth",
    tools: "SEO · AI search · content",
    body: "Found by the people searching — on Google today, and inside AI answers tomorrow.",
  },
  {
    level: "Level 3",
    name: "Automation",
    tools: "CRM · workflows · follow-ups",
    body: "The repetitive work — follow-ups, paperwork, reporting — starts running itself.",
  },
  {
    level: "Level 4",
    name: "AI assistance",
    tools: "Chatbots · copilots · knowledge AI",
    body: "Assistants answer customers and arm your team with everything the company knows.",
  },
  {
    level: "Level 5",
    name: "Agentic AI",
    tools: "AI agents · multi-agent systems",
    body: "Agents that plan and execute whole workflows — with human approval where it matters.",
  },
];

export default function MaturityJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.5"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="shell section" aria-label="The AI maturity journey">
      <SectionHead
        eyebrow="The maturity journey"
        title={
          <>
            Every business climbs <em className="serif-i not-italic">the same road.</em>
          </>
        }
      />
      <Rise delay={0.1}>
        <p className="mt-6 max-w-xl text-ash">
          Most companies are somewhere on this road already. We meet you at your
          level — and build the next one.
        </p>
      </Rise>

      <div ref={ref} className="relative mt-16 max-w-3xl">
        {/* rising current */}
        <div aria-hidden className="absolute bottom-0 left-[7px] top-0 w-px bg-hairline md:left-[9px]">
          <motion.div
            style={{ scaleY: lineScale }}
            className="h-full w-px origin-top bg-gradient-to-b from-corona-soft to-corona"
          />
        </div>

        <ol className="space-y-12">
          {LEVELS.map((l, i) => (
            <Rise as="li" key={l.level} delay={i * 0.04}>
              <div className="relative pl-10 md:pl-14">
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 grid h-4 w-4 place-items-center rounded-full border border-corona-soft/50 bg-night md:h-5 md:w-5"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle at 35% 35%, var(--color-corona-soft), var(--color-corona))",
                    }}
                  />
                </span>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <p className="mono-s text-corona-soft/80">{l.level}</p>
                  <h3 className="display display-md">{l.name}</h3>
                  <p className="mono-s text-ash">{l.tools}</p>
                </div>
                <p className="mt-2 max-w-lg text-ash">{l.body}</p>
              </div>
            </Rise>
          ))}
        </ol>
      </div>

      <Rise className="mt-14">
        <Link
          href="/contact/"
          className="mono-s inline-block text-moon underline decoration-corona/60 underline-offset-8 transition-colors hover:text-corona-soft"
        >
          Find your level — book an AI consultation →
        </Link>
      </Rise>
    </section>
  );
}
