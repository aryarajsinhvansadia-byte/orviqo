import Link from "next/link";
import Spotlight from "@/components/Spotlight";
import { Stagger, StaggerItem, Rise } from "@/components/motion";

/**
 * The four pillars — the repositioning in one glance. Connected by a live
 * data-flow line: one practice, four disciplines feeding each other.
 */
const PILLARS = [
  {
    key: "Build",
    what: "Websites & digital products",
    how: "High-performance sites, web apps and e-commerce — engineered, not assembled.",
    href: "/services/#web-digital",
  },
  {
    key: "Grow",
    what: "SEO & AI search",
    how: "Found by people on Google, cited by machines in AI answers.",
    href: "/services/#seo-ai-search",
  },
  {
    key: "Automate",
    what: "Business process automation",
    how: "Workflows, follow-ups and paperwork that run themselves.",
    href: "/services/#automation",
  },
  {
    key: "Transform",
    what: "AI agents & enterprise AI",
    how: "Assistants, copilots and agents woven into how you operate.",
    href: "/ai-solutions/",
  },
];

export default function Pillars() {
  return (
    <section className="shell section" aria-label="What ORVIQO does">
      <Rise>
        <p className="max-w-2xl text-lg text-ash">
          One technology partner across the whole arc —{" "}
          <span className="text-moon">
            from the first website to an AI-run operation.
          </span>
        </p>
      </Rise>
      <div className="relative mt-12">
        {/* the connecting current */}
        <div aria-hidden className="flow-link absolute left-0 right-0 top-0 hidden h-px lg:block" />
        <Stagger gap={0.09} className="grid gap-10 pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {PILLARS.map((p, i) => (
            <StaggerItem key={p.key}>
              <Link href={p.href} data-cursor="Open" className="group block">
                <Spotlight radius={220} className="h-full rounded-[3px] border border-hairline bg-night/60 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-corona-soft/30">
                  <p className="mono-s text-corona-soft/80">0{i + 1}</p>
                  <h3 className="display display-md mt-3 transition-colors duration-300 group-hover:text-corona-soft">
                    {p.key}
                  </h3>
                  <p className="mt-1 text-moon/85">{p.what}</p>
                  <p className="mt-3 text-sm text-ash">{p.how}</p>
                </Spotlight>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
