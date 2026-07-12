import Link from "next/link";
import SectionHead from "@/components/SectionHead";
import { Rise } from "@/components/motion";
import { processPhases } from "@/lib/content";

export default function ProcessTeaser() {
  return (
    <section className="shell section">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.5fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead
            eyebrow="The method"
            title={
              <>
                Nine weeks,
                <br />
                <em className="serif-i not-italic">no surprises.</em>
              </>
            }
          />
          <Rise delay={0.15}>
            <p className="mt-8 max-w-sm text-ash">
              Every engagement runs the same disciplined arc — from listening
              to launch to the long, quiet work of getting better every month.
            </p>
            <Link
              href="/process/"
              className="mono-s mt-8 inline-block text-moon underline decoration-corona/60 underline-offset-8 transition-colors hover:text-corona-soft"
            >
              The full method →
            </Link>
          </Rise>
        </div>
        <ol className="border-t border-hairline">
          {processPhases.map((phase, i) => (
            <Rise as="li" key={phase.number} delay={i * 0.04}>
              <div className="grid gap-4 border-b border-hairline py-9 md:grid-cols-[5rem_1fr]">
                <span className="display text-3xl text-ash/70">{phase.number}</span>
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="display display-md">{phase.name}</h3>
                    <span className="mono-s text-ash">{phase.duration}</span>
                  </div>
                  <p className="mt-3 max-w-xl text-ash">{phase.body}</p>
                  <p className="mono-s mt-4 text-corona-soft/90">
                    ↳ {phase.artifact}
                  </p>
                </div>
              </div>
            </Rise>
          ))}
        </ol>
      </div>
    </section>
  );
}
