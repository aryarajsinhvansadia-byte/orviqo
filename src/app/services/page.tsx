import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Button from "@/components/Button";
import { Rise } from "@/components/motion";
import AppTimelapse from "@/components/AppTimelapse";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web & digital experiences, mobile apps, SEO & AI search, AI & agentic solutions, business automation, custom software, AI consulting, brand identity and continuous care — nine crafts practised by one senior team at ORVIQO.",
  alternates: { canonical: "/services/" },
};

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: services.map((s, i) => ({
    "@type": "Service",
    position: i + 1,
    name: s.name,
    description: s.summary,
    provider: { "@type": "Organization", name: site.name, url: site.url },
  })),
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        lines={[
          <span key="l1">Nine crafts.</span>,
          <span key="l2">
            <em className="serif-i not-italic">One table.</em>
          </span>,
        ]}
        intro="Strategy, design, engineering, intelligence and care — practised together, so nothing is lost in handoffs. Because there aren't any."
      />

      <div className="border-t border-hairline">
        {services.map((s, i) => (
          <section
            key={s.slug}
            id={s.slug}
            className={`scroll-mt-24 ${i % 2 === 1 ? "bg-slate" : ""}`}
          >
            <div className="shell section">
              <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
                <div>
                  <Rise>
                    <p className="eyebrow mb-6">{s.tags.join(" · ")}</p>
                    <h2 className="display display-xl">{s.name}</h2>
                    <p className="serif-i mt-4 text-2xl text-corona-soft/90">{s.line}</p>
                  </Rise>
                  <div className="mt-8 max-w-xl space-y-5 text-ash">
                    {s.detail.map((p, j) => (
                      <Rise as="p" key={j} delay={j * 0.06}>
                        {p}
                      </Rise>
                    ))}
                  </div>
                </div>
                <Rise delay={0.1}>
                  <div className="border-t border-hairline pt-6 lg:mt-2">
                    <h3 className="eyebrow mb-6">What's included</h3>
                    <ul className="space-y-3">
                      {s.deliverables.map((d) => (
                        <li key={d} className="flex items-baseline gap-3 text-moon/90">
                          <span
                            aria-hidden
                            className="h-1.5 w-1.5 shrink-0 translate-y-[-2px] rounded-full"
                            style={{
                              background:
                                "radial-gradient(circle at 35% 35%, var(--color-corona-soft), var(--color-corona))",
                              boxShadow: "0 0 8px rgba(255,139,61,0.5)",
                            }}
                          />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Rise>
              </div>
            </div>
          </section>
        ))}
      </div>

      <AppTimelapse />

      <section className="shell section text-center">
        <Rise>
          <h2 className="display display-xl">
            Not sure which craft <em className="serif-i not-italic">you need?</em>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-ash">
            Most projects blend two or three. Tell us the ambition — we'll shape the engagement.
          </p>
          <div className="mt-10 flex justify-center">
            <Button href="/contact/">Talk it through</Button>
          </div>
        </Rise>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
    </>
  );
}
