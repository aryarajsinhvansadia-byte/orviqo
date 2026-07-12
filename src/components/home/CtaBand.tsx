import Button from "@/components/Button";
import Orb from "@/components/Orb";
import { Rise, MaskLines } from "@/components/motion";
import { site } from "@/lib/site";

export default function CtaBand() {
  return (
    <section className="relative overflow-hidden">
      <div className="shell relative z-10 flex min-h-[70svh] flex-col items-center justify-center py-32 text-center">
        <Rise>
          <p className="eyebrow mb-8">Begin</p>
        </Rise>
        <MaskLines
          as="h2"
          className="display display-xl"
          lines={[
            <span key="l1">Book your</span>,
            <span key="l2">
              <em className="serif-i not-italic">last</em> redesign.
            </span>,
          ]}
        />
        <Rise delay={0.2}>
          <p className="mx-auto mt-8 max-w-md text-ash">
            One conversation. No deck, no pressure — just an honest read on
            what your digital presence could earn you.
          </p>
        </Rise>
        <Rise delay={0.3}>
          <div className="mt-10 flex flex-col items-center gap-6">
            <Button href="/contact/">Start a project</Button>
            <a
              href={`mailto:${site.email}`}
              className="mono-s text-ash underline-offset-4 transition-colors hover:text-moon hover:underline"
            >
              or write to {site.email}
            </a>
          </div>
        </Rise>
      </div>
      {/* dawn on the horizon */}
      <Orb variant="dawn" className="absolute inset-x-0 bottom-0 h-72" />
    </section>
  );
}
