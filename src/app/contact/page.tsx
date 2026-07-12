import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import LocalTime from "@/components/LocalTime";
import { Rise } from "@/components/motion";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with ORVIQO. One conversation, an honest read on what your digital presence could earn you — replies within one working day.",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        lines={[
          <span key="l1">Tell us</span>,
          <span key="l2">
            the <em className="serif-i not-italic">ambition.</em>
          </span>,
        ]}
        intro="No discovery-call theatre. Write a few honest lines about what you're building; we reply within one working day with a point of view — not a pitch."
      />
      <section className="shell grid gap-16 border-t border-hairline pt-16 pb-32 lg:grid-cols-[1.4fr_1fr]">
        <Rise>
          <ContactForm />
        </Rise>
        <Rise delay={0.15}>
          <div className="flex flex-col gap-10 border-t border-hairline pt-8 lg:border-t-0 lg:pt-0">
            <div>
              <h2 className="eyebrow mb-4">Prefer plain email?</h2>
              <a
                href={`mailto:${site.email}`}
                className="display display-md underline decoration-corona/60 decoration-1 underline-offset-8 transition-colors hover:text-corona-soft"
              >
                {site.email}
              </a>
            </div>
            <div>
              <h2 className="eyebrow mb-4">The studio clock</h2>
              <p className="text-ash">
                <LocalTime className="text-moon" />
                <br />
                Based in {site.location}, replying across every timezone we've
                met so far.
              </p>
            </div>
            <div>
              <h2 className="eyebrow mb-4">What happens next</h2>
              <ol className="space-y-3 text-ash">
                <li className="flex gap-4">
                  <span className="mono-s text-corona-soft/90">01</span>
                  We reply within one working day.
                </li>
                <li className="flex gap-4">
                  <span className="mono-s text-corona-soft/90">02</span>A
                  45-minute call — your goals, our honest read.
                </li>
                <li className="flex gap-4">
                  <span className="mono-s text-corona-soft/90">03</span>A
                  fixed proposal in writing, within a week.
                </li>
              </ol>
            </div>
          </div>
        </Rise>
      </section>
    </>
  );
}
