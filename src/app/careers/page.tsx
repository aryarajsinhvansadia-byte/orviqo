import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHead from "@/components/SectionHead";
import Accordion from "@/components/Accordion";
import { Rise } from "@/components/motion";
import { roles } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join ORVIQO — a small, senior, remote-first studio building the quiet kind of famous. Open roles in design, engineering and motion.",
  alternates: { canonical: "/careers/" },
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        lines={[
          <span key="l1">A small bench,</span>,
          <span key="l2">
            <em className="serif-i not-italic">deep talent.</em>
          </span>,
        ]}
        intro="We hire slowly, pay properly, and keep the team small enough that your name stays on the work. Remote-first, craft-obsessed, ego-averse."
      />

      <section className="shell section border-t border-hairline">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.6fr]">
          <SectionHead
            eyebrow="Open roles"
            title={<>Currently listening for</>}
          />
          <Rise>
            <Accordion
              items={roles.map((r) => ({
                title: r.title,
                meta: r.type,
                body: (
                  <div className="space-y-5">
                    <p>{r.blurb}</p>
                    <ul className="space-y-2">
                      {r.asks.map((a) => (
                        <li key={a} className="flex items-baseline gap-3">
                          <span
                            aria-hidden
                            className="h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{
                              background:
                                "radial-gradient(circle at 35% 35%, var(--color-corona-soft), var(--color-corona))",
                            }}
                          />
                          {a}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={`mailto:${site.email}?subject=${encodeURIComponent(
                        `Application — ${r.title}`
                      )}`}
                      className="mono-s inline-block text-moon underline decoration-corona/60 underline-offset-8 transition-colors hover:text-corona-soft"
                    >
                      Apply with your portfolio →
                    </a>
                  </div>
                ),
              }))}
            />
          </Rise>
        </div>
      </section>

      <section className="on-dawn bg-dawn text-night">
        <div className="shell section">
          <div className="mx-auto max-w-3xl text-center">
            <Rise>
              <h2 className="display display-lg">
                No role that fits? <em className="serif-i not-italic">Write anyway.</em>
              </h2>
              <p className="mx-auto mt-6 max-w-lg text-night/65">
                The best people we've worked with arrived before the job
                existed. Send the work you're proudest of and one paragraph on
                why ORVIQO — we read everything.
              </p>
              <a
                href={`mailto:${site.email}?subject=Quiet%20application`}
                className="mono-s mt-8 inline-block underline decoration-corona underline-offset-8 transition-opacity hover:opacity-70"
              >
                {site.email}
              </a>
            </Rise>
          </div>
        </div>
      </section>
    </>
  );
}
