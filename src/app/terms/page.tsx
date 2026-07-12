import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The terms that govern use of the ORVIQO website and our engagements.",
  alternates: { canonical: "/terms/" },
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal — updated July 2026"
        lines={[<span key="l1">Terms, briefly.</span>]}
      />
      <section className="shell border-t border-hairline pt-16 pb-32">
        <div className="prose-orv mx-auto">
          <h2>Using this website</h2>
          <p>
            This site exists to show you our work and start conversations. You
            may browse, share and link to it freely. Please don't scrape it
            wholesale, misrepresent it as your own, or attempt to break it —
            the last one mostly wastes your evening, since there's no server
            to break.
          </p>
          <h2>Our content</h2>
          <p>
            The writing, design, artwork and code of this site belong to
            ORVIQO. Case-study names, metrics and testimonials are presented
            as illustrations of engagement outcomes. Quoting brief excerpts
            with attribution is welcome.
          </p>
          <h2>Client engagements</h2>
          <p>
            Project work is governed by the written proposal and agreement we
            sign together — scope, fees, timelines, ownership and
            confidentiality live there, not here. In every engagement: you own
            your code, your content and your accounts.
          </p>
          <h2>No warranties</h2>
          <p>
            This website is provided as-is. We work hard to keep everything on
            it accurate and fast, but we make no guarantees about
            uninterrupted availability or fitness for a particular purpose.
          </p>
          <h2>Questions</h2>
          <p>
            Anything unclear? {site.email} — a human reads it.
          </p>
        </div>
      </section>
    </>
  );
}
