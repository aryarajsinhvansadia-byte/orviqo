import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReadingProgress from "@/components/ReadingProgress";
import { MaskLines, Rise } from "@/components/motion";
import { posts, getPost } from "@/lib/posts";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/journal/${post.slug}/` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const others = posts.filter((p) => p.slug !== slug).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    mainEntityOfPage: `${site.url}/journal/${post.slug}/`,
  };

  return (
    <article>
      <ReadingProgress />
      <header className="shell pt-40 md:pt-48">
        <Rise>
          <p className="eyebrow mb-8">
            {post.tag} · {post.dateLabel} · {post.readingTime} read
          </p>
        </Rise>
        <MaskLines
          as="h1"
          className="display display-hero max-w-5xl"
          delay={0.1}
          eager
          lines={[<span key="l1">{post.title}</span>]}
        />
        <Rise delay={0.25}>
          <p className="serif-i mt-8 max-w-2xl text-2xl text-ash">{post.excerpt}</p>
        </Rise>
      </header>

      <div className="shell mt-16 border-t border-hairline pt-16 pb-24">
        <div className="prose-orv mx-auto">
          {post.body.map((block, i) => {
            if (block.h) return <h2 key={i}>{block.h}</h2>;
            if (block.quote) return <blockquote key={i}>{block.quote}</blockquote>;
            if (block.list)
              return (
                <ul key={i}>
                  {block.list.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              );
            return <p key={i}>{block.p}</p>;
          })}
        </div>
      </div>

      <aside className="border-t border-hairline">
        <div className="shell py-16">
          <p className="eyebrow mb-8">Keep reading</p>
          <div className="grid gap-10 md:grid-cols-2">
            {others.map((p) => (
              <Link
                key={p.slug}
                href={`/journal/${p.slug}/`}
                data-cursor="Read"
                className="group border-t border-hairline pt-5"
              >
                <span className="mono-s text-ash">{p.dateLabel}</span>
                <h3 className="display display-md mt-2 transition-colors duration-300 group-hover:text-corona-soft">
                  {p.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </aside>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
}
