import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Manifesto from "@/components/home/Manifesto";
import SelectedWork from "@/components/home/SelectedWork";
import ProjectTimelapse from "@/components/home/ProjectTimelapse";
import AgentTheatre from "@/components/home/AgentTheatre";
import ServicesIndex from "@/components/home/ServicesIndex";
import Standard from "@/components/home/Standard";
import ProcessTeaser from "@/components/home/ProcessTeaser";
import Stack from "@/components/home/Stack";
import Faq from "@/components/home/Faq";
import Insights from "@/components/home/Insights";
import CtaBand from "@/components/home/CtaBand";
import Marquee from "@/components/Marquee";
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
      {/* Sections float over the living background; the dawn + slate bands
          are intentional opaque "scenes" that punctuate the aurora. */}
      <Hero />
      <Manifesto />
      <Marquee />
      <SelectedWork />
      <ProjectTimelapse />
      <ServicesIndex />
      <AgentTheatre />
      <Standard />
      <ProcessTeaser />
      <Stack />
      <Faq />
      <Insights />
      <CtaBand />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
