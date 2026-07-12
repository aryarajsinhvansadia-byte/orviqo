import Link from "next/link";
import SectionHead from "@/components/SectionHead";
import { Stagger, StaggerItem } from "@/components/motion";
import { posts } from "@/lib/posts";

export default function Insights() {
  return (
    <section className="shell section">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHead
          eyebrow="Journal"
          title={
            <>
              Thinking, <em className="serif-i not-italic">out loud.</em>
            </>
          }
        />
        <Link
          href="/journal/"
          className="mono-s mb-2 text-ash underline-offset-8 transition-colors hover:text-moon hover:underline"
        >
          All essays →
        </Link>
      </div>
      <Stagger className="mt-14 border-t border-hairline">
        {posts.slice(0, 3).map((post) => (
          <StaggerItem key={post.slug}>
            <Link
              href={`/journal/${post.slug}/`}
              data-cursor="Read"
              className="group grid gap-3 border-b border-hairline py-8 md:grid-cols-[9rem_1fr_auto] md:items-baseline md:gap-8"
            >
              <span className="mono-s text-ash">{post.dateLabel}</span>
              <div>
                <h3 className="display display-md transition-colors duration-300 group-hover:text-corona-soft">
                  {post.title}
                </h3>
                <p className="mt-2 max-w-2xl text-ash">{post.excerpt}</p>
              </div>
              <span className="mono-s text-ash">{post.readingTime}</span>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
