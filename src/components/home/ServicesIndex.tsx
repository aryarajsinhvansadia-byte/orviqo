import Link from "next/link";
import SectionHead from "@/components/SectionHead";
import { Stagger, StaggerItem } from "@/components/motion";
import { services } from "@/lib/services";

export default function ServicesIndex() {
  return (
    <section className="shell section">
      <SectionHead
        eyebrow="Services"
        title={
          <>
            Five crafts. <em className="serif-i not-italic">One table.</em>
          </>
        }
      />
      <Stagger className="mt-16 border-t border-hairline">
        {services.map((s) => (
          <StaggerItem key={s.slug}>
            <Link
              href={`/services/#${s.slug}`}
              data-cursor="Open"
              className="group grid items-baseline gap-2 border-b border-hairline py-8 transition-all duration-500 hover:bg-slate hover:px-6 md:grid-cols-[1.2fr_1fr_auto] md:gap-8"
            >
              <h3 className="display display-lg transition-colors duration-300 group-hover:text-corona-soft">
                {s.name}
              </h3>
              <p className="serif-i text-xl text-ash">{s.line}</p>
              <span
                aria-hidden
                className="hidden text-2xl text-ash transition-all duration-300 group-hover:translate-x-1 group-hover:text-moon md:block"
              >
                →
              </span>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
