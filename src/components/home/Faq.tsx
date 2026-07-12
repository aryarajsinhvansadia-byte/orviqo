import SectionHead from "@/components/SectionHead";
import Accordion from "@/components/Accordion";
import { Rise } from "@/components/motion";
import { faqs } from "@/lib/content";

export default function Faq() {
  return (
    <section className="shell section">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.6fr]">
        <SectionHead
          eyebrow="Questions"
          title={
            <>
              Asked often, <em className="serif-i not-italic">answered plainly.</em>
            </>
          }
        />
        <Rise className="lg:mt-1">
          <Accordion
            items={faqs.map((f) => ({ title: f.q, body: <p>{f.a}</p> }))}
          />
        </Rise>
      </div>
    </section>
  );
}
