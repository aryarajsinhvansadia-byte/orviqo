import SectionHead from "@/components/SectionHead";
import AnimatedNumber from "@/components/AnimatedNumber";
import { Rise, Stagger, StaggerItem } from "@/components/motion";
import { metrics, principles } from "@/lib/content";

export default function Standard() {
  return (
    <section className="bg-slate">
      <div className="shell section">
        <SectionHead
          eyebrow="Why ORVIQO"
          title={
            <>
              Held to a <em className="serif-i not-italic">private</em> standard.
            </>
          }
        />
        <Stagger className="mt-16 grid gap-10 md:grid-cols-3">
          {principles.map((p) => (
            <StaggerItem key={p.title}>
              <div className="border-t border-hairline pt-6">
                <h3 className="display display-md mb-4">{p.title}</h3>
                <p className="text-ash">{p.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <Rise className="mt-24">
          <dl className="grid gap-10 border-t border-hairline pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label}>
                <dd className="display light-text text-[clamp(2.6rem,5vw,4.2rem)] leading-none">
                  <AnimatedNumber value={m.value} suffix={m.suffix} />
                </dd>
                <dt className="mt-3 max-w-[16rem] text-ash">{m.label}</dt>
              </div>
            ))}
          </dl>
        </Rise>
      </div>
    </section>
  );
}
