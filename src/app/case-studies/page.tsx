import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { Stagger, StaggerItem } from "@/components/motion";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Case studies",
  description:
    "Measurable outcomes from ORVIQO engagements — enquiries tripled, bookings doubled, call volume cut by two thirds. The numbers behind the work.",
  alternates: { canonical: "/case-studies/" },
};

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Case studies"
        lines={[
          <span key="l1">Numbers first.</span>,
          <span key="l2">
            <em className="serif-i not-italic">Adjectives later.</em>
          </span>,
        ]}
        intro="Every engagement ends the same way it starts: with measurement. These are the outcomes our clients quote back to us."
      />
      <section className="shell pb-32">
        <Stagger className="border-t border-hairline">
          {projects.map((p) => (
            <StaggerItem key={p.slug}>
              <Link
                href={`/work/${p.slug}/`}
                data-cursor="Open"
                className="group grid items-center gap-6 border-b border-hairline py-10 transition-all duration-500 hover:bg-slate hover:px-6 lg:grid-cols-[16rem_1fr_auto]"
              >
                <span className="display light-text text-[clamp(2.2rem,4vw,3.4rem)] leading-none">
                  {p.metrics[0].value}
                </span>
                <div>
                  <p className="text-ash">{p.metrics[0].label}</p>
                  <h2 className="display display-md mt-1 transition-colors duration-300 group-hover:text-corona-soft">
                    {p.client}
                    <span className="text-ash"> · {p.sector}</span>
                  </h2>
                </div>
                <span
                  aria-hidden
                  className="hidden text-2xl text-ash transition-all duration-300 group-hover:translate-x-1 group-hover:text-moon lg:block"
                >
                  →
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </>
  );
}
