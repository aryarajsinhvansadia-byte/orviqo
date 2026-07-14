import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Manifesto from "@/components/home/Manifesto";
import SelectedWork from "@/components/home/SelectedWork";
import ServicesIndex from "@/components/home/ServicesIndex";
import Standard from "@/components/home/Standard";
import ProcessTeaser from "@/components/home/ProcessTeaser";
import Stack from "@/components/home/Stack";
import Faq from "@/components/home/Faq";
import Insights from "@/components/home/Insights";
import CtaBand from "@/components/home/CtaBand";
import { faqs } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Home() {
  return (
    <>
      {/* pinned hero: the scene beneath — the next act scrolls over it */}
      <div className="md:sticky md:top-0 md:z-0">
        <Hero />
      </div>
      <div className="relative z-10 bg-night">
        <Manifesto />
        <SelectedWork />
        <ServicesIndex />
        <Standard />
        <ProcessTeaser />
        <Stack />
        <Faq />
        <Insights />
        <CtaBand />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
