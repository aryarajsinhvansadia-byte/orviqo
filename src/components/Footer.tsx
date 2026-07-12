import Link from "next/link";
import { nav, site } from "@/lib/site";
import LocalTime from "@/components/LocalTime";

function Column({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="eyebrow mb-5">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link
              href={l.href}
              className="text-ash transition-colors duration-300 hover:text-moon"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-night">
      <div className="shell pt-16 pb-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <a
              href={`mailto:${site.email}`}
              className="display display-md w-fit underline decoration-corona/60 decoration-1 underline-offset-8 transition-colors hover:text-corona-soft"
            >
              {site.email}
            </a>
            <div className="mt-2 flex flex-col gap-1.5 text-ash">
              <LocalTime />
              <span className="mono-s">Based in {site.location} · Working worldwide</span>
            </div>
            <div className="mt-4 flex gap-6">
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono-s text-ash transition-colors hover:text-moon"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <Column title="Studio" links={nav.footer.studio} />
          <Column title="Work" links={nav.footer.work} />
          <Column title="Legal" links={nav.footer.legal} />
        </div>

        {/* the giant wordmark */}
        <div className="mt-20 select-none overflow-hidden" aria-hidden>
          <div
            className="display text-center leading-[0.85] tracking-[0.04em]"
            style={{
              fontSize: "clamp(4rem, 15.5vw, 15rem)",
              background:
                "linear-gradient(180deg, rgba(234,232,227,0.16) 0%, rgba(234,232,227,0.03) 90%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            ORVIQO
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6 text-ash">
          <span className="mono-s">
            © {new Date().getFullYear()} {site.name} — made with unreasonable care
          </span>
          <a href="#top" className="mono-s transition-colors hover:text-moon">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
