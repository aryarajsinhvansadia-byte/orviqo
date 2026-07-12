import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { Stagger, StaggerItem } from "@/components/motion";
import { posts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Essays from the ORVIQO studio on craft, performance, AI and the quieter way to win on the web.",
  alternates: { canonical: "/journal/" },
};

export default function JournalPage() {
  return (
    <>
      <PageHero
        eyebrow="Journal"
        lines={[
          <span key="l1">Notes from</span>,
          <span key="l2">
            the <em className="serif-i not-italic">quiet room.</em>
          </span>,
        ]}
        intro="What we're learning as we build — on craft, speed, intelligence and the economics of being remembered."
      />
      <section className="shell pb-32">
        <Stagger className="border-t border-hairline">
          {posts.map((post) => (
            <StaggerItem key={post.slug}>
              <Link
                href={`/journal/${post.slug}/`}
                data-cursor="Read"
                className="group grid gap-3 border-b border-hairline py-10 md:grid-cols-[9rem_1fr_auto] md:items-baseline md:gap-8"
              >
                <div className="flex flex-col gap-1">
                  <span className="mono-s text-ash">{post.dateLabel}</span>
                  <span className="mono-s text-corona-soft/80">{post.tag}</span>
                </div>
                <div>
                  <h2 className="display display-lg transition-colors duration-300 group-hover:text-corona-soft">
                    {post.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-ash">{post.excerpt}</p>
                </div>
                <span className="mono-s text-ash">{post.readingTime}</span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </>
  );
}
