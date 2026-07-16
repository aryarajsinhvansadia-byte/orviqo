import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectMedia from "@/components/ProjectMedia";
import Parallax from "@/components/Parallax";
import ReadingProgress from "@/components/ReadingProgress";
import { MaskLines, Rise } from "@/components/motion";
import { projects, getProject, nextProject } from "@/lib/projects";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.client} — Case study`,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}/` },
  };
}

function Passage({
  label,
  paragraphs,
}: {
  label: string;
  paragraphs: string[];
}) {
  return (
    <section className="grid gap-8 border-t border-hairline py-16 lg:grid-cols-[16rem_1fr]">
      <Rise>
        <h2 className="eyebrow">{label}</h2>
      </Rise>
      <div className="max-w-2xl space-y-6 text-lg text-ash">
        {paragraphs.map((p, i) => (
          <Rise as="p" key={i} delay={i * 0.05}>
            {p}
          </Rise>
        ))}
      </div>
    </section>
  );
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const next = nextProject(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${project.client} — case study`,
    description: project.summary,
    creator: { "@type": "Organization", name: site.name, url: site.url },
    dateCreated: project.year,
    url: `${site.url}/work/${project.slug}/`,
  };

  return (
    <article>
      <ReadingProgress />
      <header className="shell pt-40 md:pt-48">
        <Rise>
          <p className="eyebrow mb-8">
            Case study — {project.sector} · {project.location} · {project.year}
          </p>
        </Rise>
        <MaskLines
          as="h1"
          className="display display-hero"
          delay={0.1}
          eager
          lines={[<span key="l1">{project.client}</span>]}
        />
        <Rise delay={0.25}>
          <p className="serif-i mt-6 max-w-2xl text-[clamp(1.4rem,2.6vw,2.1rem)] text-corona-soft/90">
            {project.narrative}
          </p>
        </Rise>
        {project.liveUrl && (
          <Rise delay={0.3}>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Visit"
              className="group mt-8 inline-flex items-center gap-3 rounded-full border border-hairline px-6 py-3 text-moon transition-colors duration-300 hover:border-corona-soft/60"
            >
              <span className="mono-s">
                Visit {project.liveUrl.replace(/^https?:\/\//, "")}
              </span>
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                ↗
              </span>
            </a>
          </Rise>
        )}
        <Rise delay={0.35}>
          <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-hairline pt-6 md:grid-cols-4">
            <div>
              <dt className="eyebrow mb-2">Client</dt>
              <dd>{project.client}</dd>
            </div>
            <div>
              <dt className="eyebrow mb-2">Sector</dt>
              <dd>{project.sector}</dd>
            </div>
            <div>
              <dt className="eyebrow mb-2">Year</dt>
              <dd>{project.year}</dd>
            </div>
            <div>
              <dt className="eyebrow mb-2">Services</dt>
              <dd className="text-moon/90">{project.services.join(", ")}</dd>
            </div>
          </dl>
        </Rise>
      </header>

      {/* full-bleed cinematic plate */}
      <Rise className="mt-16">
        <Parallax className="h-[68svh] w-full max-md:h-[46svh]">
          <ProjectMedia project={project} priority />
        </Parallax>
      </Rise>

      <div className="shell mt-20">
        <Passage label="The challenge" paragraphs={project.challenge} />
        <Passage label="The approach" paragraphs={project.approach} />
        <Passage label="The outcome" paragraphs={project.outcome} />

        <section className="border-t border-hairline py-16">
          <dl className="grid gap-10 sm:grid-cols-3">
            {project.metrics.map((m) => (
              <Rise key={m.label}>
                <dd className="display light-text text-[clamp(2.4rem,4.6vw,4rem)] leading-none">
                  {m.value}
                </dd>
                <dt className="mt-3 text-ash">{m.label}</dt>
              </Rise>
            ))}
          </dl>
        </section>

        {project.quote && (
          <section className="border-t border-hairline py-20">
            <Rise>
              <figure className="mx-auto max-w-3xl text-center">
                <blockquote className="serif-i text-[clamp(1.5rem,3vw,2.4rem)] leading-[1.3]">
                  “{project.quote.text}”
                </blockquote>
                <figcaption className="mt-8 text-ash">
                  <span className="text-moon">{project.quote.author}</span> — {project.quote.role}
                </figcaption>
              </figure>
            </Rise>
          </section>
        )}
      </div>

      {/* next project */}
      <Link
        href={`/work/${next.slug}/`}
        data-cursor="Next"
        className="group block border-t border-hairline"
      >
        <div className="shell flex flex-col gap-3 py-20 text-center">
          <span className="eyebrow">Next case</span>
          <span className="display display-xl transition-colors duration-300 group-hover:text-corona-soft">
            {next.client}
          </span>
          <span className="serif-i text-lg text-ash">{next.narrative}</span>
        </div>
      </Link>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
}
