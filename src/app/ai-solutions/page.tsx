import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import FlowDiagram from "@/components/FlowDiagram";
import Spotlight from "@/components/Spotlight";
import Button from "@/components/Button";
import { Rise, Stagger, StaggerItem } from "@/components/motion";
import { solutions } from "@/lib/solutions";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Solutions — Agents, RAG, Voice AI, Automation",
  description:
    "ORVIQO's AI solutions: AI agents and multi-agent systems, custom chatbots, RAG knowledge AI, voice AI, copilots, document intelligence, enterprise search, automation and AI orchestration — built into real business operations.",
  alternates: { canonical: "/ai-solutions/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: solutions.map((s, i) => ({
    "@type": "Service",
    position: i + 1,
    name: s.name,
    description: s.oneLiner,
    provider: { "@type": "Organization", name: site.name, url: site.url },
  })),
};

export default function AiSolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="AI solutions"
        lines={[
          <span key="l1">Intelligence, wired</span>,
          <span key="l2">
            into <em className="serif-i not-italic">operations.</em>
          </span>,
        ]}
        intro="Not isolated demos — assistants, agents and automations connected to your data, your tools and your day-to-day. Twelve ways in, one standard of craft."
      />

      {/* the grid of twelve */}
      <section className="shell pb-8">
        <Stagger gap={0.05} className="grid gap-px overflow-hidden rounded-[3px] border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s) => (
            <StaggerItem key={s.slug} className="h-full">
              <Link href={`#${s.slug}`} data-cursor="Open" className="block h-full">
                <Spotlight radius={220} className="flex h-full flex-col gap-3 bg-night p-7 transition-colors duration-300 hover:bg-slate">
                  <h2 className="display display-md">{s.name}</h2>
                  <p className="text-sm text-ash">{s.oneLiner}</p>
                  <p className="mono-s mt-auto pt-3 text-corona-soft/80">
                    e.g. {s.businessUse}
                  </p>
                  <span className="mono-s text-moon/70">Explore solution ↓</span>
                </Spotlight>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* the twelve, in depth */}
      <div className="border-t border-hairline">
        {solutions.map((s, i) => (
          <section
            key={s.slug}
            id={s.slug}
            className={`scroll-mt-24 ${i % 2 === 1 ? "bg-slate" : ""}`}
          >
            <div className="shell py-16 md:py-20">
              <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr]">
                <div>
                  <Rise>
                    <p className="eyebrow mb-4">
                      {String(i + 1).padStart(2, "0")} — AI solutions
                    </p>
                    <h2 className="display display-lg">{s.name}</h2>
                    <p className="serif-i mt-3 text-xl text-corona-soft/90">{s.oneLiner}</p>
                  </Rise>
                  <div className="mt-6 max-w-xl space-y-4 text-ash">
                    {s.explain.map((p, j) => (
                      <Rise as="p" key={j} delay={j * 0.05}>
                        {p}
                      </Rise>
                    ))}
                  </div>
                  <Rise delay={0.1}>
                    <FlowDiagram steps={s.flow} className="mt-8" />
                  </Rise>
                </div>
                <Rise delay={0.12}>
                  <div className="border-t border-hairline pt-6 lg:mt-1">
                    <h3 className="eyebrow mb-5">Where it earns its keep</h3>
                    <ul className="space-y-2.5">
                      {s.useCases.map((u) => (
                        <li key={u} className="flex items-baseline gap-3 text-moon/90">
                          <span
                            aria-hidden
                            className="h-1.5 w-1.5 shrink-0 translate-y-[-2px] rounded-full"
                            style={{
                              background:
                                "radial-gradient(circle at 35% 35%, var(--color-corona-soft), var(--color-corona))",
                            }}
                          />
                          {u}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/contact/"
                      className="mono-s mt-7 inline-block text-moon underline decoration-corona/60 underline-offset-8 transition-colors hover:text-corona-soft"
                    >
                      {s.cta} →
                    </Link>
                  </div>
                </Rise>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* governance note */}
      <section className="shell section">
        <div className="max-w-3xl">
          <Rise>
            <p className="eyebrow mb-6">Built responsibly</p>
            <h2 className="display display-lg">
              Guardrails are a feature, <em className="serif-i not-italic">not a footnote.</em>
            </h2>
            <p className="mt-6 text-ash">
              Enterprise AI earns trust through controls: role-based access,
              human-in-the-loop approvals, data-access boundaries, logging,
              monitoring and auditability — designed into every system we ship,
              scoped to each client&apos;s requirements. We implement
              responsibly, and we claim no certification we don&apos;t hold.
            </p>
          </Rise>
        </div>
      </section>

      {/* CTA */}
      <section className="shell pb-32 text-center">
        <Rise>
          <h2 className="display display-xl">
            See it working <em className="serif-i not-italic">first.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-ash">
            The Demo Lab runs live and simulated demonstrations of these
            systems — try them before a single call.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="/demo-lab/">Enter the Demo Lab</Button>
            <Button href="/contact/" variant="ghost">
              Book an AI consultation
            </Button>
          </div>
        </Rise>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
