import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHead from "@/components/SectionHead";
import Button from "@/components/Button";
import Orb from "@/components/Orb";
import { Rise, Stagger, StaggerItem } from "@/components/motion";
import { principles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "ORVIQO is a small, senior digital studio in Vadodara working worldwide — designing and engineering websites, brands and AI systems built to be remembered.",
  alternates: { canonical: "/about/" },
};

const beliefs = [
  {
    title: "Small is the strategy",
    body: "ORVIQO stays deliberately small: a senior bench, no account-manager relay, no juniors learning on your invoice. Every project gets the people whose names are on the door.",
  },
  {
    title: "Worldwide by default",
    body: "Based in Vadodara, shipping everywhere. Our clients span nine countries and most of them we've never met in person — just in launches, numbers, and long-running Slack channels.",
  },
  {
    title: "Taste is a discipline",
    body: "We believe restraint can be engineered. Every ORVIQO project passes the same private review: if a section feels ordinary, it gets redesigned before you ever see it.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="The studio"
        lines={[
          <span key="l1">Built like the work:</span>,
          <span key="l2">
            <em className="serif-i not-italic">small, sharp, deliberate.</em>
          </span>,
        ]}
        intro="ORVIQO exists because ambitious companies kept having to choose between agencies that design and agencies that build. We refused the choice."
      />

      <section className="shell section border-t border-hairline">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr]">
          <SectionHead eyebrow="The story" />
          <div className="space-y-6 text-lg text-ash">
            <Rise as="p">
              ORVIQO began in 2024 with an observation: the internet had never
              been louder, and the brands people actually trusted had never
              been quieter. Restraint had quietly become the rarest thing on
              the web — and the most valuable.
            </Rise>
            <Rise as="p">
              So we built a studio around it. One team where strategy, design
              and engineering happen at the same table, so nothing gets lost
              between the idea and the shipped page. We design in the
              browser's reality. We set performance budgets before moodboards.
              We treat AI as plumbing, not fireworks.
            </Rise>
            <Rise as="p">
              The name carries the idea: inside ORVIQO is an <em className="serif-i text-moon">orb</em> —
              a body of light that doesn't chase attention, and holds it
              anyway. That's the standard every project here is held to.
            </Rise>
          </div>
        </div>
      </section>

      <section className="on-dawn bg-dawn text-night">
        <div className="shell section">
          <SectionHead light eyebrow="How we're built" title={<>Three commitments, kept.</>} />
          <Stagger className="mt-16 grid gap-10 md:grid-cols-3">
            {beliefs.map((b) => (
              <StaggerItem key={b.title}>
                <div className="border-t border-inkline pt-6">
                  <h3 className="display display-md mb-4">{b.title}</h3>
                  <p className="text-night/65">{b.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="shell section">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr]">
          <SectionHead eyebrow="The standard" />
          <Stagger className="space-y-0 border-t border-hairline">
            {principles.map((p) => (
              <StaggerItem key={p.title}>
                <div className="grid gap-2 border-b border-hairline py-7 md:grid-cols-[16rem_1fr] md:gap-8">
                  <h3 className="display display-md">{p.title}</h3>
                  <p className="text-ash">{p.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="shell relative z-10 flex flex-col items-center py-28 text-center">
          <Rise>
            <h2 className="display display-xl max-w-3xl">
              Sound like your kind of <em className="serif-i not-italic">team?</em>
            </h2>
          </Rise>
          <Rise delay={0.15}>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button href="/contact/">Start a project</Button>
              <Button href="/careers/" variant="ghost">
                Join the bench
              </Button>
            </div>
          </Rise>
        </div>
        <Orb variant="dawn" className="absolute inset-x-0 bottom-0 h-56" />
      </section>
    </>
  );
}
