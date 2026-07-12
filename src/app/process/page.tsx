import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Button from "@/components/Button";
import { Rise } from "@/components/motion";
import { processPhases } from "@/lib/content";

export const metadata: Metadata = {
  title: "Process",
  description:
    "The ORVIQO method: five phases from listening to launch to the long, quiet work of getting better every month. Nine weeks, no surprises.",
  alternates: { canonical: "/process/" },
};

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="The method"
        lines={[
          <span key="l1">Nine weeks,</span>,
          <span key="l2">
            <em className="serif-i not-italic">no surprises.</em>
          </span>,
        ]}
        intro="Great websites aren't acts of inspiration; they're acts of sequence. Here is ours — the same five phases, every engagement, refined with every launch."
      />

      <div className="border-t border-hairline">
        {processPhases.map((phase, i) => (
          <section key={phase.number} className={i % 2 === 1 ? "bg-slate" : ""}>
            <div className="shell py-20 md:py-24">
              <div className="grid items-start gap-10 md:grid-cols-[10rem_1fr_16rem]">
                <Rise>
                  <span
                    className="display block leading-none text-[clamp(4rem,9vw,8rem)]"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(234,232,227,0.35), rgba(234,232,227,0.06))",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {phase.number}
                  </span>
                </Rise>
                <div>
                  <Rise delay={0.08}>
                    <h2 className="display display-lg">{phase.name}</h2>
                    <p className="mt-4 max-w-xl text-lg text-ash">{phase.body}</p>
                  </Rise>
                </div>
                <Rise delay={0.15}>
                  <div className="border-t border-hairline pt-4">
                    <p className="eyebrow">Timeline</p>
                    <p className="mono-s mt-2 text-moon">{phase.duration}</p>
                    <p className="eyebrow mt-6">You receive</p>
                    <p className="mono-s mt-2 text-corona-soft/90">{phase.artifact}</p>
                  </div>
                </Rise>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="shell section text-center">
        <Rise>
          <h2 className="display display-xl">
            Phase <em className="serif-i not-italic">zero</em> is a conversation.
          </h2>
          <div className="mt-10 flex justify-center">
            <Button href="/contact/">Start phase zero</Button>
          </div>
        </Rise>
      </section>
    </>
  );
}
