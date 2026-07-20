import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Button from "@/components/Button";
import SectionHead from "@/components/SectionHead";
import FlowDiagram from "@/components/FlowDiagram";
import { Rise, Stagger, StaggerItem } from "@/components/motion";
import { processPhases, aiPhases } from "@/lib/content";

export const metadata: Metadata = {
  title: "Process",
  description:
    "How ORVIQO works: five phases for web and brand builds, and a five-phase AI lifecycle — assess, prioritise, pilot, integrate, govern. No surprises either way.",
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

      {/* the AI lifecycle */}
      <section className="border-t border-hairline bg-slate">
        <div className="shell section">
          <SectionHead
            eyebrow="AI projects run differently"
            title={
              <>
                Prove it small. <em className="serif-i not-italic">Then let it run.</em>
              </>
            }
          />
          <Rise delay={0.08}>
            <p className="mt-6 max-w-xl text-ash">
              Websites are built once and refined. AI systems are proven first,
              trusted second, scaled third — so the lifecycle bends toward
              evidence: no big-bang builds, no demos that die in a drawer.
            </p>
            <FlowDiagram
              steps={["Assess", "Prioritise", "Pilot", "Integrate", "Govern"]}
              className="mt-8"
            />
          </Rise>
          <Stagger gap={0.07} className="mt-14 grid gap-10 border-t border-hairline pt-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            {aiPhases.map((phase) => (
              <StaggerItem key={phase.number}>
                <p className="mono-s text-corona-soft/80">{phase.number}</p>
                <h3 className="display display-md mt-2">{phase.name}</h3>
                <p className="mono-s mt-1 text-ash">{phase.duration}</p>
                <p className="mt-4 text-sm text-ash">{phase.body}</p>
                <p className="mono-s mt-4 text-corona-soft/90">{phase.artifact}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

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
