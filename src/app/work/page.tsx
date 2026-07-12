import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import WorkGallery from "@/components/WorkGallery";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects by ORVIQO — websites, brands, AI systems and growth engines for ambitious companies in nine countries.",
  alternates: { canonical: "/work/" },
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="The exhibition"
        lines={[
          <span key="l1">Work that earned</span>,
          <span key="l2">
            its <em className="serif-i not-italic">quiet.</em>
          </span>,
        ]}
        intro="Every project here shipped, performed, and paid for itself. Browse by discipline — or wander."
      />
      <section className="shell pb-32">
        <WorkGallery />
      </section>
    </>
  );
}
