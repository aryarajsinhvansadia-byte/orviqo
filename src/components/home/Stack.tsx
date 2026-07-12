import SectionHead from "@/components/SectionHead";
import { Stagger, StaggerItem } from "@/components/motion";
import { stack } from "@/lib/content";

export default function Stack() {
  return (
    <section className="shell section">
      <SectionHead eyebrow="Instruments" />
      <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
        <h2 className="display display-lg max-w-xl">
          Boring choices, <em className="serif-i not-italic">brilliant</em> results.
        </h2>
        <p className="max-w-sm text-ash">
          We build on the modern web's most proven tools — chosen for speed,
          longevity and the size of the community behind them.
        </p>
      </div>
      <Stagger gap={0.04} className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-[3px] border border-hairline bg-hairline md:grid-cols-4">
        {stack.map((item) => (
          <StaggerItem key={item.name}>
            <div className="group h-full bg-night p-6 transition-colors duration-300 hover:bg-slate">
              <p className="mono-s text-moon transition-colors group-hover:text-corona-soft">
                {item.name}
              </p>
              <p className="mono-s mt-1 text-ash">{item.role}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
