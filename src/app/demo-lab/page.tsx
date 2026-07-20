import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHead from "@/components/SectionHead";
import Button from "@/components/Button";
import AgentTheatre from "@/components/home/AgentTheatre";
import RoiCalculator from "@/components/demolab/RoiCalculator";
import ReadinessQuiz from "@/components/demolab/ReadinessQuiz";
import UseCaseFinder from "@/components/demolab/UseCaseFinder";
import VoiceDemo from "@/components/demolab/VoiceDemo";
import { Rise } from "@/components/motion";

export const metadata: Metadata = {
  title: "AI Demo Lab — try our AI before a single call",
  description:
    "Experience ORVIQO's AI capabilities live: a real agent that plans your project, a Voice AI call simulation, an automation ROI calculator, an AI readiness assessment and a use-case finder.",
  alternates: { canonical: "/demo-lab/" },
};

export default function DemoLabPage() {
  return (
    <>
      <PageHero
        eyebrow="The demo lab"
        lines={[
          <span key="l1">Don&apos;t take</span>,
          <span key="l2">
            our <em className="serif-i not-italic">word for it.</em>
          </span>,
        ]}
        intro="Most companies describe their AI. We let you use ours. Five instruments — one live, the rest honest simulations and estimators — each a taste of what we build for clients."
      />

      {/* 01 — live agent */}
      <div className="border-t border-hairline">
        <section className="shell pt-16">
          <SectionHead
            eyebrow="01 — Live · runs on a real model"
            title={
              <>
                The agent that plans <em className="serif-i not-italic">your project.</em>
              </>
            }
          />
        </section>
        <AgentTheatre />
      </div>

      {/* 02 — voice */}
      <section className="bg-slate">
        <div className="shell section">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHead
                eyebrow="02 — Simulation"
                title={
                  <>
                    A receptionist who never <em className="serif-i not-italic">misses a call.</em>
                  </>
                }
              />
              <Rise delay={0.1}>
                <p className="mt-6 max-w-md text-ash">
                  Voice AI answers, qualifies, books and routes — politely, at
                  any hour. Play the call to hear the conversation design;
                  production systems connect to your real phone lines.
                </p>
              </Rise>
            </div>
            <Rise delay={0.15}>
              <VoiceDemo />
            </Rise>
          </div>
        </div>
      </section>

      {/* 03 — ROI */}
      <section className="shell section">
        <SectionHead
          eyebrow="03 — Estimator"
          title={
            <>
              What is repetition <em className="serif-i not-italic">costing you?</em>
            </>
          }
        />
        <Rise delay={0.1} className="mt-12">
          <RoiCalculator />
        </Rise>
      </section>

      {/* 04 — readiness */}
      <section className="bg-slate">
        <div className="shell section">
          <SectionHead
            eyebrow="04 — Assessment"
            title={
              <>
                How AI-ready are <em className="serif-i not-italic">you, really?</em>
              </>
            }
          />
          <Rise delay={0.1} className="mt-12">
            <ReadinessQuiz />
          </Rise>
        </div>
      </section>

      {/* 05 — use case finder */}
      <section className="shell section">
        <SectionHead
          eyebrow="05 — Finder"
          title={
            <>
              Find your <em className="serif-i not-italic">first use case.</em>
            </>
          }
        />
        <Rise delay={0.1} className="mt-12">
          <UseCaseFinder />
        </Rise>
      </section>

      {/* closing CTA */}
      <section className="shell pb-32 text-center">
        <Rise>
          <h2 className="display display-xl">
            Liked the lab? <em className="serif-i not-italic">Meet the builders.</em>
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="/contact/">Book an AI consultation</Button>
            <Button href="/ai-solutions/" variant="ghost">
              Explore all AI solutions
            </Button>
          </div>
        </Rise>
      </section>
    </>
  );
}
