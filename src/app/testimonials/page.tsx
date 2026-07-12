import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Button from "@/components/Button";
import { Rise, Stagger, StaggerItem } from "@/components/motion";
import { testimonials } from "@/lib/content";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "What founders, partners and brand directors say about working with ORVIQO — in their own words.",
  alternates: { canonical: "/testimonials/" },
};

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        eyebrow="Client voices"
        lines={[
          <span key="l1">Their words,</span>,
          <span key="l2">
            <em className="serif-i not-italic">not ours.</em>
          </span>,
        ]}
        intro="We could tell you the work is good. It lands differently coming from the people who paid for it."
      />
      <section className="shell pb-24">
        <Stagger className="grid gap-px overflow-hidden rounded-[3px] border border-hairline bg-hairline md:grid-cols-2">
          {testimonials.map((t) => (
            <StaggerItem key={t.author} className="h-full">
              <figure className="flex h-full flex-col justify-between gap-10 bg-night p-10 transition-colors duration-300 hover:bg-slate">
                <blockquote className="serif-i text-2xl leading-[1.35]">
                  “{t.quote}”
                </blockquote>
                <figcaption className="flex items-end justify-between gap-6">
                  <div>
                    <p className="font-medium">{t.author}</p>
                    <p className="text-ash">{t.role}</p>
                  </div>
                  <Link
                    href={`/work/${t.project}/`}
                    className="mono-s shrink-0 text-ash underline-offset-4 transition-colors hover:text-corona-soft hover:underline"
                  >
                    The project →
                  </Link>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
        <Rise className="mt-20 text-center">
          <p className="serif-i text-xl text-ash">The next quote here could be yours.</p>
          <div className="mt-8 flex justify-center">
            <Button href="/contact/">Start a project</Button>
          </div>
        </Rise>
      </section>
    </>
  );
}
