import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Spotlight from "@/components/Spotlight";
import Button from "@/components/Button";
import { Rise, Stagger, StaggerItem } from "@/components/motion";
import { industries } from "@/lib/industries";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Industries — AI & digital systems by sector",
  description:
    "How ORVIQO applies AI, automation and web engineering in healthcare, interiors, real estate, retail, hospitality, education, professional services and manufacturing.",
  alternates: { canonical: "/industries/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: industries.map((ind, i) => ({
    "@type": "Service",
    position: i + 1,
    name: `AI & digital systems for ${ind.name}`,
    description: ind.line,
    provider: { "@type": "Organization", name: site.name, url: site.url },
  })),
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        lines={[
          <span key="l1">Your sector,</span>,
          <span key="l2">
            <em className="serif-i not-italic">understood.</em>
          </span>,
        ]}
        intro="The technology is shared; the problems are not. Eight sectors, each with the plays we'd run first — grounded in real work where we've done it, and said plainly where we haven't."
      />

      {/* index */}
      <section className="shell pb-8">
        <Stagger gap={0.05} className="grid gap-px overflow-hidden rounded-[3px] border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((ind) => (
            <StaggerItem key={ind.slug} className="h-full">
              <Link href={`#${ind.slug}`} data-cursor="Open" className="block h-full">
                <Spotlight radius={200} className="flex h-full flex-col gap-3 bg-night p-6 transition-colors duration-300 hover:bg-slate">
                  <h2 className="display display-md">{ind.name}</h2>
                  <p className="mt-auto pt-2 text-sm text-ash">{ind.line}</p>
                </Spotlight>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* per-industry playbooks */}
      <div className="border-t border-hairline">
        {industries.map((ind, i) => (
          <section
            key={ind.slug}
            id={ind.slug}
            className={`scroll-mt-24 ${i % 2 === 1 ? "bg-slate" : ""}`}
          >
            <div className="shell py-16 md:py-20">
              <Rise>
                <p className="eyebrow mb-4">
                  {String(i + 1).padStart(2, "0")} — Industries
                </p>
                <h2 className="display display-lg">{ind.name}</h2>
                <p className="serif-i mt-3 max-w-xl text-xl text-corona-soft/90">{ind.line}</p>
              </Rise>

              <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
                <Rise delay={0.08}>
                  <h3 className="eyebrow mb-5">What usually hurts</h3>
                  <ul className="space-y-3">
                    {ind.pains.map((p) => (
                      <li key={p} className="flex items-baseline gap-3 text-ash">
                        <span aria-hidden className="mono-s text-corona-soft/70">—</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  {ind.proof && (
                    <p className="mono-s mt-8 max-w-xs text-corona-soft/80">
                      {ind.proof.replace(" — see the case study.", ".")}{" "}
                      <Link href="/work/" className="text-moon underline decoration-corona/60 underline-offset-4 hover:text-corona-soft">
                        See the case study →
                      </Link>
                    </p>
                  )}
                </Rise>
                <Rise delay={0.12}>
                  <h3 className="eyebrow mb-5">The plays we&apos;d run</h3>
                  <div className="grid gap-px overflow-hidden rounded-[3px] border border-hairline bg-hairline sm:grid-cols-2">
                    {ind.plays.map((play) => (
                      <Link
                        key={play.name}
                        href={play.href}
                        data-cursor="Open"
                        className="group block bg-night/80 p-5 transition-colors duration-300 hover:bg-night"
                      >
                        <p className="font-medium text-moon transition-colors duration-300 group-hover:text-corona-soft">
                          {play.name}
                        </p>
                        <p className="mt-1.5 text-sm text-ash">{play.how}</p>
                      </Link>
                    ))}
                  </div>
                </Rise>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* honesty + CTA */}
      <section className="shell section text-center">
        <Rise>
          <h2 className="display display-xl">
            Don&apos;t see <em className="serif-i not-italic">your sector?</em>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-ash">
            The patterns transfer. Tell us how your business actually runs and
            we&apos;ll tell you — honestly — where AI would earn its keep, and
            where it wouldn&apos;t.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="/contact/">Talk about your industry</Button>
            <Button href="/demo-lab/" variant="ghost">
              Try the Demo Lab first
            </Button>
          </div>
        </Rise>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
